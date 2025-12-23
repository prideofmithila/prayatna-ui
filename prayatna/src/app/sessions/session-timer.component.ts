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
  
  private sessionTimerInterval: any;
  private taskTimerInterval: any;
  private subtaskTimerInterval: any;

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
  }

  ngOnDestroy() {
    this.stopTimer();
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
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }

  togglePlayPause() {
    if (this.selectedTaskIndex === null) {
      alert('Please select a task to start the session.');
      return;
    }
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
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
  }

  startTimer() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Determine if we should countdown or count up
    const hasSessionDuration = this.session && (this.session.totalDuration || 0) > 0;
    const selectedTask = this.selectedTaskIndex !== null ? this.session?.tasks[this.selectedTaskIndex] : null;
    const hasTaskDuration = selectedTask && this.getTaskDuration(selectedTask) > 0;
    
    // Single unified timer interval for all timers (session, task, subtask)
    this.sessionTimerInterval = setInterval(() => {
      this.ngZone.run(() => {
        // Update session timer
        if (hasSessionDuration) {
          if (this.sessionElapsedSeconds > 0) {
            this.sessionElapsedSeconds--;
          }
        } else {
          this.sessionElapsedSeconds++;
        }
        
        // Update task and subtask timers if a task is selected
        if (this.selectedTaskIndex !== null && selectedTask) {
          if (hasTaskDuration) {
            // Update subtask timer
            if (selectedTask.hasSubtasks && selectedTask.subtasks) {
              // Decrement subtask timer
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
              this.taskElapsedSeconds = this.subtaskElapsedSeconds;
              for (let i = this.currentSubtaskIndex + 1; i < selectedTask.subtasks.length; i++) {
                this.taskElapsedSeconds += selectedTask.subtasks[i].duration;
              }
            } else {
              // No subtasks, count down task timer directly
              if (this.taskElapsedSeconds > 0) {
                this.taskElapsedSeconds--;
              }
            }
          } else {
            this.taskElapsedSeconds++;
          }
        }
        
        this.cdr.detectChanges();
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
    
    // If timer is running, restart with new task
    if (this.isRunning) {
      // Stop current task timer
      if (this.taskTimerInterval) {
        clearInterval(this.taskTimerInterval);
        this.taskTimerInterval = null;
      }
      
      const hasTaskDuration = selectedTask && this.getTaskDuration(selectedTask) > 0;
      
      // Start new task timer
      this.taskTimerInterval = setInterval(() => {
        if (hasTaskDuration) {
          if (this.taskElapsedSeconds > 0) this.taskElapsedSeconds--;
          this.updateSubtaskTimer();
        } else {
          this.taskElapsedSeconds++;
        }
      }, 1000);
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
}
