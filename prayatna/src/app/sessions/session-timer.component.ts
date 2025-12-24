import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsService } from './sessions.service';
import { Session, Task } from './session.model';

@Component({
  selector: 'app-session-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-timer.component.html',
  styleUrls: ['./sessions.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SessionTimerComponent implements OnInit, OnDestroy {
  session: Session | null = null;
  sessionIndex: number = -1;
  
  // Timer states
  isRunning = false;
  sessionElapsedSeconds = 0;
  taskElapsedSeconds = 0;
  subtaskElapsedSeconds = 0;
  
  selectedTaskIndex: number | null = null;
  currentSubtaskIndex: number = 0;
  showTaskSelectionModal = false;
  
  private sessionTimerInterval: any;
  private taskTimerInterval: any;
  private subtaskTimerInterval: any;
  private alarmAudio: HTMLAudioElement | null = null;
  private previousSessionWarning = false;
  private previousTaskWarning = false;
  private alarmTimeout: any = null;
  // Wake Lock state
  private wakeLock: any = null;
  private visibilityHandler = () => {
    // Re-acquire wake lock when the page becomes visible and timer is running
    if (document.visibilityState === 'visible' && this.isRunning) {
      this.requestWakeLock();
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsService: SessionsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sessionIndex = parseInt(id, 10);
      this.loadSession();
    }
    
    // Initialize alarm audio (play for 5 seconds only)
    this.alarmAudio = new Audio('prayatna-alarm.mp3');

    // Listen for visibility changes to re-acquire wake lock when needed
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  ngOnDestroy() {
    this.stopTimer();
    if (this.alarmAudio) {
      this.alarmAudio.pause();
      this.alarmAudio = null;
    }
    // Cleanup wake lock and listeners
    this.releaseWakeLock();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  loadSession() {
    const sessions = this.sessionsService.load();
    if (this.sessionIndex >= 0 && this.sessionIndex < sessions.length) {
      this.session = sessions[this.sessionIndex];
      // Initialize session elapsed time from session's total duration if it exists
      this.sessionElapsedSeconds = this.session.totalDuration || 0;
    }
  }

  formatTime(seconds: number): string {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return isNegative ? `-${timeStr}` : timeStr;
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }

  togglePlayPause() {
    // If session has tasks, require a task to be selected
    if (this.session && this.session.tasks && this.session.tasks.length > 0 && this.selectedTaskIndex === null) {
      this.showTaskSelectionModal = true;
      return;
    }
    
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  closeModal() {
    this.showTaskSelectionModal = false;
  }

  pauseTimer() {
    this.isRunning = false;
    
    if (this.sessionTimerInterval) {
      clearInterval(this.sessionTimerInterval);
      this.sessionTimerInterval = null;
    }
    
    if (this.taskTimerInterval) {
      clearInterval(this.taskTimerInterval);
      this.taskTimerInterval = null;
    }
    
    if (this.subtaskTimerInterval) {
      clearInterval(this.subtaskTimerInterval);
      this.subtaskTimerInterval = null;
    }
    
    this.stopAlarm();
    this.releaseWakeLock();
  }

  startTimer() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    // Keep device screen awake while timer is running
    this.requestWakeLock();
    
    // Determine if we should countdown or count up
    const hasSessionDuration = this.session && (this.session.totalDuration || 0) > 0;
    const selectedTask = this.selectedTaskIndex !== null ? this.session?.tasks[this.selectedTaskIndex] : null;
    const hasTaskDuration = selectedTask && this.getTaskDuration(selectedTask) > 0;
    
    // Single unified timer interval for all timers (session, task, subtask)
    this.sessionTimerInterval = setInterval(() => {
      this.ngZone.run(() => {
        // Update session timer
        if (hasSessionDuration) {
          this.sessionElapsedSeconds--;
        } else {
          this.sessionElapsedSeconds++;
        }
        
        // Update task and subtask timers if a task is selected
        if (this.selectedTaskIndex !== null && selectedTask) {
          if (hasTaskDuration) {
            // Update subtask timer
            if (selectedTask.hasSubtasks && selectedTask.subtasks) {
              // Decrement subtask timer (but keep at 0, don't go negative)
              if (this.subtaskElapsedSeconds > 0) {
                this.subtaskElapsedSeconds--;
              }
              
              // Check if we need to switch to next subtask (after decrementing to 0)
              if (this.subtaskElapsedSeconds === 0 && this.currentSubtaskIndex < selectedTask.subtasks.length - 1) {
                // Current subtask completed, move to next subtask
                this.currentSubtaskIndex++;
                this.subtaskElapsedSeconds = selectedTask.subtasks[this.currentSubtaskIndex].duration;
              }
              
              // Calculate task elapsed seconds based on remaining subtasks
              // Task time = current subtask remaining + all future subtasks
              // But if all subtasks are done (current is last and at 0), decrement task timer into negative
              if (this.subtaskElapsedSeconds === 0 && this.currentSubtaskIndex === selectedTask.subtasks.length - 1) {
                // All subtasks complete, let task timer go negative
                this.taskElapsedSeconds--;
              } else {
                // Still have subtasks remaining, calculate from subtasks
                this.taskElapsedSeconds = this.subtaskElapsedSeconds;
                for (let i = this.currentSubtaskIndex + 1; i < selectedTask.subtasks.length; i++) {
                  this.taskElapsedSeconds += selectedTask.subtasks[i].duration;
                }
              }
            } else {
              // No subtasks, count down task timer directly
              this.taskElapsedSeconds--;
            }
          } else {
            this.taskElapsedSeconds++;
          }
        }
        
        this.cdr.detectChanges();
        
        // Check if we should play alarm
        this.checkAlarmState();
      });
    }, 1000);
  }

  private initializeSubtaskTimer() {
    const selectedTask = this.session?.tasks[this.selectedTaskIndex || 0];
    if (selectedTask && selectedTask.hasSubtasks && selectedTask.subtasks) {
      // Reset to first subtask
      this.currentSubtaskIndex = 0;
      this.subtaskElapsedSeconds = selectedTask.subtasks[0]?.duration || 0;
    } else {
      this.currentSubtaskIndex = 0;
      this.subtaskElapsedSeconds = 0;
    }
  }

  private updateSubtaskTimer() {
    const selectedTask = this.session?.tasks[this.selectedTaskIndex || 0];
    if (selectedTask && selectedTask.hasSubtasks && selectedTask.subtasks && selectedTask.subtasks.length > 0) {
      // Find current subtask index and update
      let totalTime = 0;
      let currentSubtaskIndex = 0;
      
      for (let i = 0; i < selectedTask.subtasks.length; i++) {
        totalTime += selectedTask.subtasks[i].duration;
        if (this.subtaskElapsedSeconds <= totalTime) {
          currentSubtaskIndex = i;
          break;
        }
      }
      
      // Set subtask elapsed to current subtask duration
      if (currentSubtaskIndex < selectedTask.subtasks.length) {
        this.subtaskElapsedSeconds = selectedTask.subtasks[currentSubtaskIndex].duration;
      }
    }
  }

  stopTimer() {
    this.isRunning = false;
    
    if (this.sessionTimerInterval) {
      clearInterval(this.sessionTimerInterval);
      this.sessionTimerInterval = null;
    }
    
    if (this.taskTimerInterval) {
      clearInterval(this.taskTimerInterval);
      this.taskTimerInterval = null;
    }
    
    if (this.subtaskTimerInterval) {
      clearInterval(this.subtaskTimerInterval);
      this.subtaskTimerInterval = null;
    }
    
    // Stop alarm and reset warning states
    this.stopAlarm();
    this.previousSessionWarning = false;
    this.previousTaskWarning = false;
    this.releaseWakeLock();
    
    // Reset all timers to default values
    this.sessionElapsedSeconds = this.session?.totalDuration || 0;
    
    if (this.selectedTaskIndex !== null) {
      const selectedTask = this.session?.tasks[this.selectedTaskIndex];
      if (selectedTask) {
        this.taskElapsedSeconds = this.getTaskDuration(selectedTask);
        this.initializeSubtaskTimer();
      }
    } else {
      this.taskElapsedSeconds = 0;
      this.subtaskElapsedSeconds = 0;
      this.currentSubtaskIndex = 0;
    }
    
    this.cdr.detectChanges();
  }

  selectTask(index: number) {
    const wasRunning = this.isRunning;
    
    // If timer is running, pause it first
    if (wasRunning) {
      this.pauseTimer();
    }
    
    this.selectedTaskIndex = index;
    
    // Always initialize task and subtask durations immediately when task is selected
    const selectedTask = this.session?.tasks[this.selectedTaskIndex];
    if (selectedTask) {
      const taskDuration = this.getTaskDuration(selectedTask);
      this.taskElapsedSeconds = taskDuration;
      this.initializeSubtaskTimer();
      
      // Explicitly trigger change detection
      this.cdr.detectChanges();
    }
    
    // If timer was running, restart with new task
    if (wasRunning) {
      this.startTimer();
    }
  }

  goBack() {
    this.router.navigate(['/sessions']);
  }

  getSelectedTaskName(): string {
    if (!this.session || this.selectedTaskIndex === null) {
      return 'Select a Task';
    }
    return this.session.tasks[this.selectedTaskIndex]?.taskName || 'Select a Task';
  }

  getTaskDuration(task: Task): number {
    if (task.hasSubtasks && task.subtasks) {
      return task.subtasks.reduce((sum, st) => sum + st.duration, 0);
    }
    return task.taskDuration || 0;
  }

  private checkAlarmState(): void {
    const sessionWarning = this.isSessionTimerNegative();
    const taskWarning = this.isTaskTimerNegative();
    const shouldPlayAlarm = sessionWarning || taskWarning;
    
    // Start alarm if entering warning state
    if (shouldPlayAlarm && !this.previousSessionWarning && !this.previousTaskWarning) {
      this.playAlarm();
    }
    // Stop alarm if leaving warning state
    else if (!shouldPlayAlarm && (this.previousSessionWarning || this.previousTaskWarning)) {
      this.stopAlarm();
    }
    
    this.previousSessionWarning = sessionWarning;
    this.previousTaskWarning = taskWarning;
  }
  
  private playAlarm(): void {
    if (this.alarmAudio && this.isRunning) {
      this.alarmAudio.currentTime = 0;
      this.alarmAudio.play().catch(err => console.log('Audio play failed:', err));
      
      // Stop audio after 5 seconds
      this.alarmTimeout = setTimeout(() => {
        this.stopAlarm();
      }, 5000);
    }
  }
  
  private stopAlarm(): void {
    if (this.alarmAudio) {
      this.alarmAudio.pause();
      this.alarmAudio.currentTime = 0;
    }
    if (this.alarmTimeout) {
      clearTimeout(this.alarmTimeout);
      this.alarmTimeout = null;
    }
  }

  private async requestWakeLock() {
    try {
      const wl = (navigator as any)?.wakeLock;
      if (!wl || typeof wl.request !== 'function') {
        return; // not supported
      }
      // Only request if not already held
      if (!this.wakeLock) {
        this.wakeLock = await wl.request('screen');
        // If the lock is released by the UA (e.g., tab hidden), try to re-acquire when visible
        this.wakeLock.addEventListener?.('release', () => {
          this.wakeLock = null;
        });
      }
    } catch (err) {
      // Ignore errors silently; wake lock may require user interaction
      console.debug('Wake Lock request failed', err);
      this.wakeLock = null;
    }
  }

  private async releaseWakeLock() {
    try {
      if (this.wakeLock && typeof this.wakeLock.release === 'function') {
        await this.wakeLock.release();
      }
    } catch {}
    this.wakeLock = null;
  }


  isSessionTimerNegative(): boolean {
    const hasSessionDuration = this.session && (this.session.totalDuration || 0) > 0;
    // For countdown timers, warn when <= 3 seconds and timer is running; for countup, never warn
    return !!hasSessionDuration && this.sessionElapsedSeconds <= 3 && this.isRunning;
  }

  isTaskTimerNegative(): boolean {
    if (this.selectedTaskIndex === null) return false;
    const selectedTask = this.session?.tasks[this.selectedTaskIndex];
    const hasTaskDuration = selectedTask && this.getTaskDuration(selectedTask) > 0;
    // For countdown timers, warn when <= 3 seconds and timer is running; for countup, never warn
    return !!hasTaskDuration && this.taskElapsedSeconds <= 3 && this.isRunning;
  }

  isSubtaskTimerNegative(): boolean {
    return this.subtaskElapsedSeconds < 0;
  }
}
