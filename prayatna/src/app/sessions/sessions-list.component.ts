import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionsService } from './sessions.service';
import { Session } from './session.model';

@Component({
  selector: 'app-sessions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions.scss']
})
export class SessionsListComponent {
  sessions: Session[] = [];
  searchTerm = '';
  showDeleteModal = false;
  sessionToDelete: number | null = null;

  constructor(private sessionsService: SessionsService, private router: Router) {
    this.sessions = this.sessionsService.load();
  }

  get filteredSessions() {
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) return this.sessions;
    return this.sessions.filter(s => s.sessionName.toLowerCase().includes(q) || (s.tasks || []).some(t => t.taskName.toLowerCase().includes(q)));
  }

  durationToHuman(sec: number) {
    if (!sec) return '00:00:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  createNew() {
    this.router.navigate(['/sessions/new']);
  }

  view(i: number) {
    this.router.navigate(['/sessions', i, 'view']);
  }

  play(i: number) {
    this.router.navigate(['/sessions', i, 'timer']);
  }

  edit(i: number) {
    this.router.navigate(['/sessions', i, 'edit']);
  }

  duplicate(i: number) {
    const s = this.sessions[i];
    const copy: Session = JSON.parse(JSON.stringify(s));
    copy.sessionName = copy.sessionName + ' (copy)';
    this.sessions.push(copy);
    this.sessionsService.save(this.sessions);
  }

  delete(i: number) {
    this.sessionToDelete = i;
    this.showDeleteModal = true;
  }
  
  confirmDelete() {
    if(this.sessionToDelete !== null) {
      this.sessions.splice(this.sessionToDelete, 1);
      this.sessionsService.save(this.sessions);
      this.sessionToDelete = null;
    }
    this.showDeleteModal = false;
  }
  
  cancelDelete() {
    this.showDeleteModal = false;
    this.sessionToDelete = null;
  }
}
