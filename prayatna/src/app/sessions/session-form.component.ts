import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PortalDirective } from '../shared/portal.directive';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionsService } from './sessions.service';
import { Session, Task } from './session.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PortalDirective],
  templateUrl: './session-form.component.html',
  styleUrls: ['./sessions.scss']
})
export class SessionFormComponent implements OnInit, OnDestroy {
  sessions: Session[] = [];
  editingIndex: number | null = null;
  isViewMode = false;
  form: FormGroup;

  taskModalOpen = false;
  subtaskModalOpen = false;
  editingTaskIndex: number | null = null;
  editingSubtaskIndex: number | null = null;
  showDeleteSessionModal = false;
  showDeleteTaskModal = false;
  taskToDelete: number | null = null;
  private reopenTaskModalAfterSubtask = false;

  taskModalForm: FormGroup;
  subtaskModalForm: FormGroup;

  private subs = new Subscription();
  private loadedForEdit = false;

  // Error tracking
  taskModalErrors: { [key: string]: string } = {};
  subtaskModalErrors: { [key: string]: string } = {};
  sessionFormErrors: { [key: string]: string } = {};

  @ViewChild('sessionNameInput') sessionNameInput!: ElementRef<HTMLInputElement>;

  constructor(private sessionsService: SessionsService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      sessionName: ['', [Validators.required, Validators.minLength(1)]],
      isTimed: [true],
      totalDuration: [0],
      durationHours: [0],
      durationMinutes: [0],
      durationSeconds: [0],
      tasks: this.fb.array([])
    });

    this.taskModalForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(1)]],
      hasSubtasks: [false],
      taskDuration: [0],
      durationHours: [0],
      durationMinutes: [0],
      durationSeconds: [0],
      subtasks: this.fb.array([])
    });

    this.subtaskModalForm = this.fb.group({
      subtaskName: ['', [Validators.required, Validators.minLength(1)]],
      duration: [0],
      durationHours: [0],
      durationMinutes: [0],
      durationSeconds: [0]
    });

    const dur = this.taskModalForm.get('taskDuration') as FormControl;
    dur.setValidators([Validators.required, Validators.min(0)]);
    dur.updateValueAndValidity({ emitEvent: false });

    const hasSub = this.taskModalForm.get('hasSubtasks') as FormControl;
    hasSub.valueChanges.subscribe((val: boolean) => {
      if (val) {
        dur.disable({ emitEvent: false });
        dur.clearValidators();
        dur.updateValueAndValidity({ emitEvent: false });
      } else {
        dur.enable({ emitEvent: false });
        dur.setValidators([Validators.required, Validators.min(0)]);
        dur.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.subs.add(this.sessionsService.sessions$.subscribe(list => {
      this.sessions = list;
      if (this.editingIndex !== null && !this.loadedForEdit && this.sessions[this.editingIndex]) {
        this.loadForEdit(this.editingIndex);
        this.loadedForEdit = true;
        if (this.isViewMode) {
          this.form.disable({ emitEvent: false });
        }
      }
    }));

    this.subs.add(this.route.paramMap.subscribe(pm => {
      this.isViewMode = (this.route.snapshot.routeConfig?.path || '').includes('view');
      const id = pm.get('id');
      if (id !== null) {
        const idx = Number(id);
        if (!isNaN(idx)) {
          this.editingIndex = idx;
          if (this.sessions[idx] && !this.loadedForEdit) {
            this.loadForEdit(idx);
            this.loadedForEdit = true;
            if (this.isViewMode) {
              this.form.disable({ emitEvent: false });
            }
          }
        }
      }
    }));

    this.sessionsService.refreshSessions();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // helpers
  get tasks(): FormArray<FormGroup> { return this.form.get('tasks') as FormArray<FormGroup>; }

  addTask(data?: Partial<Task>) {
    const subtasks = this.fb.array((data?.subtasks || []).map(s => this.fb.group({ subtaskName: [s.subtaskName], duration: [s.duration] })));
    const task = this.fb.group({ taskName: [data?.taskName || ''], hasSubtasks: [data?.hasSubtasks ?? false], taskDuration: [data?.taskDuration || 0], subtasks });
    this.tasks.push(task);
  }

  getSubtasksControls(taskIndex: number) {
    const subt = (this.tasks.at(taskIndex).get('subtasks') as FormArray | null);
    return subt ? subt.controls : [];
  }

  openTaskModal(index?: number) {
    this.editingTaskIndex = typeof index === 'number' ? index : null;
    const group = this.taskModalForm;
    const ms = group.get('subtasks') as FormArray;
    while (ms.length) ms.removeAt(0);

    if (this.editingTaskIndex !== null) {
      const t = this.tasks.at(this.editingTaskIndex).value as any;
      const dur = t.taskDuration || 0;
      const h = Math.floor(dur / 3600);
      const m = Math.floor((dur % 3600) / 60);
      const s = dur % 60;
      group.patchValue({ taskName: t.taskName, hasSubtasks: !!t.hasSubtasks, taskDuration: t.taskDuration || 0, durationHours: h, durationMinutes: m, durationSeconds: s });
      (t.subtasks || []).forEach((st: any) => ms.push(this.fb.group({ subtaskName: [st.subtaskName], duration: [st.duration] })));
    } else {
      group.reset({ taskName: '', hasSubtasks: false, taskDuration: 0, durationHours: 0, durationMinutes: 0, durationSeconds: 0 });
    }
    this.taskModalOpen = true;
    setTimeout(()=>{ try { this.sessionNameInput?.nativeElement?.focus(); } catch {} }, 0);
  }

  closeTaskModal() { 
    this.taskModalOpen = false; 
    this.editingTaskIndex = null; 
    const ms = this.taskModalForm.get('subtasks') as FormArray; 
    while(ms.length) ms.removeAt(0); 
    this.taskModalErrors = {};
  }

  saveTaskModal() {
    this.taskModalErrors = {};
    const hasSub = !!this.taskModalForm.get('hasSubtasks')?.value;
    if (hasSub && this.taskModalSubtasks.length === 0) { 
      this.taskModalErrors['subtasks'] = 'Please add at least one subtask'; 
      return; 
    }
    
    // Validate task name
    const taskNameCtrl = this.taskModalForm.get('taskName');
    if (!taskNameCtrl?.value?.trim()) { 
      this.taskModalErrors['taskName'] = 'Task name is required'; 
      return; 
    }
    
    // Validate duration for non-subtask tasks
    if (!hasSub) {
      const h = Number(this.taskModalForm.get('durationHours')?.value || 0);
      const m = Number(this.taskModalForm.get('durationMinutes')?.value || 0);
      const s = Number(this.taskModalForm.get('durationSeconds')?.value || 0);
      const totalDur = h * 3600 + m * 60 + s;
      if (totalDur === 0) { 
        this.taskModalErrors['duration'] = 'Duration is required for tasks without subtasks'; 
        return; 
      }
    }
    
    // Validate all subtasks have names and durations
    for (let i = 0; i < this.taskModalSubtasks.length; i++) {
      const st = this.taskModalSubtasks.at(i);
      const stName = st.get('subtaskName')?.value;
      const stDur = Number(st.get('duration')?.value || 0);
      if (!stName?.trim()) { 
        this.taskModalErrors[`subtask_${i}_name`] = `Subtask ${i + 1}: Name is required`; 
        return; 
      }
      if (stDur === 0) { 
        this.taskModalErrors[`subtask_${i}_duration`] = `Subtask ${i + 1}: Duration is required`; 
        return; 
      }
    }
    
    if (this.taskModalForm.invalid) return;
    const val = this.taskModalForm.value as any;
    let computedDuration = 0;
    if (hasSub) { 
      computedDuration = this.taskModalSubtasks.controls.reduce((acc, c) => acc + (Number(c.get('duration')?.value || 0)), 0); 
    } else {
      const h = Number(val.durationHours) || 0;
      const m = Number(val.durationMinutes) || 0;
      const s = Number(val.durationSeconds) || 0;
      computedDuration = h * 3600 + m * 60 + s;
    }
    const taskData: Partial<Task> = { taskName: val.taskName, hasSubtasks: hasSub, taskDuration: computedDuration, subtasks: (val.subtasks || []).map((st:any)=>({ subtaskName: st.subtaskName, duration: Number(st.duration)||0 })) };

    if (this.editingTaskIndex === null) { this.addTask(taskData); }
    else { const tg = this.tasks.at(this.editingTaskIndex) as FormGroup; tg.patchValue({ taskName: taskData.taskName, hasSubtasks: taskData.hasSubtasks, taskDuration: taskData.taskDuration }); const subt = tg.get('subtasks') as FormArray; while(subt.length) subt.removeAt(0); (taskData.subtasks||[]).forEach(st=>subt.push(this.fb.group({ subtaskName: [st.subtaskName], duration:[st.duration] }))); }

    this.closeTaskModal();
  }

  get taskModalSubtasks(): FormArray<FormGroup> { return this.taskModalForm.get('subtasks') as FormArray<FormGroup>; }
  openSubtaskModal(index?: number) {
    this.editingSubtaskIndex = typeof index === 'number' ? index : null;
    const sa = this.taskModalSubtasks;
    if (this.editingSubtaskIndex !== null) {
      const st = sa.at(this.editingSubtaskIndex).value as any;
      const dur = st.duration || 0;
      const h = Math.floor(dur / 3600);
      const m = Math.floor((dur % 3600) / 60);
      const s = dur % 60;
      this.subtaskModalForm.patchValue({ subtaskName: st.subtaskName, duration: st.duration, durationHours: h, durationMinutes: m, durationSeconds: s });
    } else {
      this.subtaskModalForm.reset({ subtaskName: '', duration: 0, durationHours: 0, durationMinutes: 0, durationSeconds: 0 });
    }
    this.reopenTaskModalAfterSubtask = this.taskModalOpen;
    this.taskModalOpen = false;
    setTimeout(() => {
      this.subtaskModalOpen = true;
      this.cdr.detectChanges();
    }, 0);
  }
  closeSubtaskModal() {
    this.subtaskModalOpen = false;
    this.editingSubtaskIndex = null;
    this.subtaskModalForm.reset({ subtaskName: '', duration: 0, durationHours: 0, durationMinutes: 0, durationSeconds: 0 });
    this.subtaskModalErrors = {};
    if (this.reopenTaskModalAfterSubtask) {
      setTimeout(() => {
        this.taskModalOpen = true;
        this.cdr.detectChanges();
      }, 0);
    }
    this.reopenTaskModalAfterSubtask = false;
  }
  saveSubtaskModal(){ 
    this.subtaskModalErrors = {};
    const stName = this.subtaskModalForm.get('subtaskName')?.value;
    if (!stName?.trim()) { 
      this.subtaskModalErrors['subtaskName'] = 'Subtask name is required'; 
      return; 
    }
    
    const h = Number(this.subtaskModalForm.get('durationHours')?.value || 0);
    const m = Number(this.subtaskModalForm.get('durationMinutes')?.value || 0);
    const s = Number(this.subtaskModalForm.get('durationSeconds')?.value || 0);
    const totalDuration = h * 3600 + m * 60 + s;
    if (totalDuration === 0) { 
      this.subtaskModalErrors['duration'] = 'Subtask duration is required'; 
      return; 
    }
    
    if(this.subtaskModalForm.invalid) return; 
    const val = this.subtaskModalForm.value as any; 
    const sa = this.taskModalSubtasks; 
    if(this.editingSubtaskIndex===null) 
      sa.push(this.fb.group({ subtaskName:[val.subtaskName], duration:[totalDuration] })); 
    else 
      sa.at(this.editingSubtaskIndex).patchValue({ subtaskName:val.subtaskName, duration:totalDuration }); 
    this.closeSubtaskModal(); 
  }

  viewTotalDurationSeconds(): number {
    const total = Number(this.form.get('totalDuration')?.value || 0);
    return total;
  }
  removeSubtaskInModal(index:number){ const sa=this.taskModalSubtasks; sa.removeAt(index); }

  get taskModalTotalDuration(){ return this.taskModalSubtasks.controls.reduce((acc,c)=>acc+(Number(c.get('duration')?.value||0)),0); }
  get taskModalComputedDuration(){ const hasSub=!!this.taskModalForm.get('hasSubtasks')?.value; return hasSub? this.taskModalTotalDuration : Number(this.taskModalForm.get('taskDuration')?.value||0); }
  taskGroupDuration(taskGroup:any){ const hasSub=!!taskGroup.get('hasSubtasks')?.value; if(hasSub){ const subt=taskGroup.get('subtasks') as FormArray|null; if(!subt) return 0; return subt.controls.reduce((acc,c)=>acc+(Number(c.get('duration')?.value||0)),0); } return Number(taskGroup.get('taskDuration')?.value||0); }

  controlAsGroup(c: AbstractControl | null): FormGroup { return c as FormGroup; }
  
  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }
  
  loadForEdit(idx:number){ const s=this.sessions[idx]; this.editingIndex=idx; const total=s.totalDuration||0; const h=Math.floor(total/3600); const m=Math.floor((total%3600)/60); const sec=total%60; this.form.patchValue({ sessionName: s.sessionName, isTimed: s.isTimed, totalDuration: s.totalDuration||0, durationHours:h, durationMinutes:m, durationSeconds:sec }); while(this.tasks.length) this.tasks.removeAt(0); s.tasks.forEach(t=>this.addTask(t)); }

  async save(){ 
    this.sessionFormErrors = {};
    // Validate session name
    const sessionNameVal = this.form.get('sessionName')?.value;
    if (!sessionNameVal?.trim()) { 
      this.sessionFormErrors['sessionName'] = 'Session name is required'; 
      return; 
    }
    
    const value=this.form.value as any; 
    const hours=Number(value.durationHours)||0; 
    const minutes=Number(value.durationMinutes)||0; 
    const seconds=Number(value.durationSeconds)||0; 
    const computedTotal=hours*3600+minutes*60+seconds; 
    const existing = (this.editingIndex !== null && this.editingIndex < this.sessions.length) ? this.sessions[this.editingIndex] : null;
    const session:Session={ 
      id: existing?.id,
      sessionName:value.sessionName, 
      isTimed:!!value.isTimed, 
      totalDuration: computedTotal>0?computedTotal:(Number(value.totalDuration)||0), 
      tasks:(value.tasks||[]).map((t:any)=>({ 
        taskName:t.taskName, 
        hasSubtasks:!!t.hasSubtasks, 
        taskDuration:Number(t.taskDuration)||0, 
        subtasks:(t.subtasks||[]).map((st:any)=>({ subtaskName:st.subtaskName, duration:Number(st.duration)||0 })) 
      })) 
    };

    try {
      await this.sessionsService.saveSession(session, this.editingIndex ?? undefined);
      await this.sessionsService.refreshSessions();
      this.router.navigate(['/sessions']);
    } catch (err) {
      // Show error to user
      const message = this.resolveApiErrorMessage(err);
      // Reassign object to ensure change detection even if running outside Angular zone
      this.sessionFormErrors = { ...this.sessionFormErrors, api: message };
      setTimeout(() => {
        try { document.getElementById('session-api-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch {}
      }, 0);
      try { this.cdr.detectChanges(); } catch {}
      console.error('Save failed:', err);
    }
  }

  cancel(){ this.router.navigate(['/sessions']); }

  goToEdit(){ if(this.editingIndex===null) return; this.router.navigate(['/sessions', this.editingIndex, 'edit']); }
  deleteCurrent(){ 
    if(this.editingIndex===null) return; 
    this.taskModalOpen = false;
    this.subtaskModalOpen = false;
    setTimeout(()=>{ 
      this.showDeleteSessionModal = true;
      this.cdr.detectChanges(); 
    }, 0);
  }
  
  async confirmDeleteSession() {
    if(this.editingIndex===null) return;
    try {
      await this.sessionsService.deleteSession(this.editingIndex);
      this.showDeleteSessionModal = false;
      this.router.navigate(['/sessions']);
    } catch (err) {
      this.showDeleteSessionModal = false;
      const message = 'Server issue: unable to delete right now. Please try again later.';
      this.sessionFormErrors = { ...this.sessionFormErrors, api: message };
      setTimeout(() => {
        try { document.getElementById('session-api-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch {}
      }, 0);
      try { this.cdr.detectChanges(); } catch {}
      console.error('Delete failed:', err);
    }
  }
  
  cancelDeleteSession() {
    this.showDeleteSessionModal = false;
  }
  
  deleteTask(index: number) {
    this.taskToDelete = index;
    this.taskModalOpen = false;
    this.subtaskModalOpen = false;
    setTimeout(()=>{ 
      this.showDeleteTaskModal = true;
      this.cdr.detectChanges(); 
    }, 0);
  }
  
  confirmDeleteTask() {
    if(this.taskToDelete !== null) {
      this.tasks.removeAt(this.taskToDelete);
      this.taskToDelete = null;
    }
    this.showDeleteTaskModal = false;
  }
  
  cancelDeleteTask() {
    this.showDeleteTaskModal = false;
    this.taskToDelete = null;
  }
  playSession(){ 
    if (this.editingIndex !== null) {
      this.router.navigate(['/sessions', this.editingIndex, 'timer']);
    }
  }

  private resolveApiErrorMessage(err: any): string {
    const errorPayload = err?.error;

    if (typeof errorPayload === 'string') {
      try {
        const parsed = JSON.parse(errorPayload);
        if (parsed?.message) return parsed.message;
        if (parsed?.error_description) return parsed.error_description;
        if (parsed?.error) return parsed.error;
      } catch {
        return errorPayload;
      }
    }

    if (errorPayload?.message) return errorPayload.message;
    if (errorPayload?.error?.message) return errorPayload.error.message;
    if (errorPayload?.detail) return errorPayload.detail;
    if (errorPayload?.title) return errorPayload.title;

    if (Array.isArray(errorPayload?.errors) && errorPayload.errors.length) {
      return errorPayload.errors.join('; ');
    }
    if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
      const flattened = Object.values(errorPayload.errors).flat().filter(Boolean).join('; ');
      if (flattened) return flattened;
    }

    if (err?.message) return err.message;
    if (err?.status) return `Request failed (${err.status})`;
    return 'Failed to save session. Please try again.';
  }
}
