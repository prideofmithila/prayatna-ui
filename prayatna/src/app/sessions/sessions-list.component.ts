import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { SessionsService } from './sessions.service';
import { Session } from './session.model';

@Component({
  selector: 'app-sessions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions.scss']
})
export class SessionsListComponent implements OnInit, OnDestroy {
  sessions: Session[] = [];
  searchTerm = '';
  showDeleteModal = false;
  sessionToDelete: number | null = null;
  errorMessage: string | null = null;
  showLocalStorageWarning = false;
  isLoggedIn = false;
  fromAddButton = false;
  isLoading = true;
  private sub = new Subscription();

  constructor(private sessionsService: SessionsService, private router: Router, private cdr: ChangeDetectorRef, private oauthService: OAuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.oauthService.hasValidAccessToken();
    
    // Show warning for non-logged-in users once per day
    if (!this.isLoggedIn) {
      const lastShown = localStorage.getItem('localStorageWarningLastShown');
      const today = new Date().toDateString();
      if (lastShown !== today) {
        this.showLocalStorageWarning = true;
        localStorage.setItem('localStorageWarningLastShown', today);
      }
    }
    
    this.sub.add(this.sessionsService.sessions$.subscribe(s => {
      this.sessions = s;
      console.log('Sessions updated in list component:', s.length);
      this.isLoading = false;
      this.cdr.detectChanges();
    }));
    // Always refresh when component initializes to get latest data
    this.isLoading = true;
    this.sessionsService.refreshSessions().catch(err => {
      this.errorMessage = 'Failed to load sessions. Please try again.';
      this.isLoading = false;
      console.error('Refresh failed:', err);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  dismissLocalStorageWarning() {
    this.showLocalStorageWarning = false;
    if (this.fromAddButton) {
      this.fromAddButton = false;
      this.router.navigate(['/sessions/new']);
    }
  }

  goToLogin() {
    this.showLocalStorageWarning = false;
    sessionStorage.setItem('returnUrl', this.router.url);
    this.router.navigate(['/login']);
  }

  get deleteBlocked(): boolean {
    const idx = this.sessionToDelete;
    if (!this.isLoggedIn && idx !== null && idx >= 0 && idx < this.sessions.length) {
      const target = this.sessions[idx];
      return !!target?.id; // allow deleting local-only (no id), block API/system sessions
    }
    return false;
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
    if (!this.isLoggedIn) {
      this.fromAddButton = true;
      this.showLocalStorageWarning = true;
    } else {
      this.router.navigate(['/sessions/new']);
    }
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

  async duplicate(i: number) {
    const s = this.sessions[i];
    if (!s) return;
    const copy: Session = JSON.parse(JSON.stringify(s));
    copy.id = undefined;
    copy.sessionName = `${copy.sessionName} (copy)`;
    try {
      await this.sessionsService.saveSession(copy);
      this.errorMessage = null;
      await this.sessionsService.refreshSessions();
    } catch (err) {
      this.errorMessage = 'Failed to duplicate session. Please try again.';
      console.error('Duplicate failed:', err);
    }
  }

  delete(i: number) {
    this.sessionToDelete = i;
    this.showDeleteModal = true;
  }
  
  async confirmDelete() {
    if(this.sessionToDelete !== null) {
      try {
        await this.sessionsService.deleteSession(this.sessionToDelete);
        this.errorMessage = null;
        this.sessionToDelete = null;
      } catch (err: any) {
        this.errorMessage = err?.message || 'Failed to delete session. Please try again.';
        console.error('Delete failed:', err);
      }
    }
    this.showDeleteModal = false;
  }
  
  cancelDelete() {
    this.showDeleteModal = false;
    this.sessionToDelete = null;
  }
}

// Debug marker
