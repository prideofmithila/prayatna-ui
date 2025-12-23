import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PortalDirective } from '../shared/portal.directive';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionsService } from './sessions.service';
import { Session, Task } from './session.model';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PortalDirective],
  templateUrl: './session-form.component.html',
  styleUrls: ['./sessions.scss']
})
export class SessionFormComponent implements OnInit {
  sessions: Session[] = [];
  editingIndex: number | null = null;
  isViewMode = false;
  form: FormGroup;

  taskModalOpen = false;
  subtaskModalOpen = false;
  editingTaskIndex: number | null = null;
  editingSubtaskIndex: number | null = null;

  taskModalForm: FormGroup;
  subtaskModalForm: FormGroup;

  @ViewChild('sessionNameInput') sessionNameInput!: ElementRef<HTMLInputElement>;

  constructor(private sessionsService: SessionsService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.sessions = this.sessionsService.load();

    this.form = this.fb.group({
      sessionName: [''],
      isTimed: [true],
      totalDuration: [0],
      durationHours: [0],
      durationMinutes: [0],
      durationSeconds: [0],
      tasks: this.fb.array([])
    });

    this.taskModalForm = this.fb.group({
      taskName: ['', Validators.required],
      hasSubtasks: [false],
      taskDuration: [0],
      durationHours: [0],
      durationMinutes: [0],
      durationSeconds: [0],
      subtasks: this.fb.array([])
    });

    this.subtaskModalForm = this.fb.group({
      subtaskName: ['', Validators.required],
      duration: [0, [Validators.min(0)]],
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
    this.route.paramMap.subscribe(pm => {
      this.isViewMode = (this.route.snapshot.routeConfig?.path || '').includes('view');
      const id = pm.get('id');
      if (id !== null) {
        const idx = Number(id);
        if (!isNaN(idx) && idx >= 0 && idx < this.sessions.length) {
          this.loadForEdit(idx);
          if (this.isViewMode) {
            this.form.disable({ emitEvent: false });
          }
        }
      }
    });
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

  closeTaskModal() { this.taskModalOpen = false; this.editingTaskIndex = null; const ms = this.taskModalForm.get('subtasks') as FormArray; while(ms.length) ms.removeAt(0); }

  saveTaskModal() {
    const hasSub = !!this.taskModalForm.get('hasSubtasks')?.value;
    if (hasSub && this.taskModalSubtasks.length === 0) { alert('Please add at least one subtask'); return; }
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
    if (this.editingSubtaskIndex !== null){ 
      const st = sa.at(this.editingSubtaskIndex).value as any; 
      const dur = st.duration || 0;
      const h = Math.floor(dur / 3600);
      const m = Math.floor((dur % 3600) / 60);
      const s = dur % 60;
      this.subtaskModalForm.patchValue({ subtaskName: st.subtaskName, duration: st.duration, durationHours: h, durationMinutes: m, durationSeconds: s }); 
    } else { 
      this.subtaskModalForm.reset({ subtaskName:'', duration:0, durationHours: 0, durationMinutes: 0, durationSeconds: 0 }); 
    } 
    this.subtaskModalOpen = true; 
  }
  closeSubtaskModal() { this.subtaskModalOpen = false; this.editingSubtaskIndex = null; this.subtaskModalForm.reset({ subtaskName:'', duration:0, durationHours: 0, durationMinutes: 0, durationSeconds: 0 }); }
  saveSubtaskModal(){ 
    if(this.subtaskModalForm.invalid) return; 
    const val = this.subtaskModalForm.value as any; 
    const h = Number(val.durationHours) || 0;
    const m = Number(val.durationMinutes) || 0;
    const s = Number(val.durationSeconds) || 0;
    const totalDuration = h * 3600 + m * 60 + s;
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

  save(){ const value=this.form.value as any; const hours=Number(value.durationHours)||0; const minutes=Number(value.durationMinutes)||0; const seconds=Number(value.durationSeconds)||0; const computedTotal=hours*3600+minutes*60+seconds; const session:Session={ sessionName:value.sessionName, isTimed:!!value.isTimed, totalDuration: computedTotal>0?computedTotal:(Number(value.totalDuration)||0), tasks:(value.tasks||[]).map((t:any)=>({ taskName:t.taskName, hasSubtasks:!!t.hasSubtasks, taskDuration:Number(t.taskDuration)||0, subtasks:(t.subtasks||[]).map((st:any)=>({ subtaskName:st.subtaskName, duration:Number(st.duration)||0 })) })) };

    if(this.editingIndex===null){ this.sessions.push(session); } else { this.sessions[this.editingIndex]=session; }

    this.sessionsService.save(this.sessions);
    this.router.navigate(['/sessions']);
  }

  cancel(){ this.router.navigate(['/sessions']); }

  goToEdit(){ if(this.editingIndex===null) return; this.router.navigate(['/sessions', this.editingIndex, 'edit']); }
  deleteCurrent(){ if(this.editingIndex===null) return; if(!confirm('Delete session?')) return; this.sessions.splice(this.editingIndex,1); this.sessionsService.save(this.sessions); this.router.navigate(['/sessions']); }
  playSession(){ 
    if (this.editingIndex !== null) {
      this.router.navigate(['/sessions', this.editingIndex, 'timer']);
    }
  }
}
