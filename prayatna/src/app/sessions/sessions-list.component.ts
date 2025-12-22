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

  constructor(private sessionsService: SessionsService, private router: Router) {
    this.sessions = this.sessionsService.load();
  }

  get filteredSessions() {
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) return this.sessions;
    return this.sessions.filter(s => s.sessionName.toLowerCase().includes(q) || (s.tasks || []).some(t => t.taskName.toLowerCase().includes(q)));
  }

  durationToHuman(sec: number) {
    if (!sec) return '0s';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${s ? s + 's' : ''}`.trim();
  }

  createNew() {
    this.router.navigate(['/sessions/new']);
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
    if (!confirm('Delete session?')) return;
    this.sessions.splice(i, 1);
    this.sessionsService.save(this.sessions);
  }
}
