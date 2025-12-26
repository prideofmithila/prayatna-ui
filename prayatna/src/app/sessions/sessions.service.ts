import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';
import { Session, Task, Subtask } from './session.model';

const STORAGE_KEY = 'prayatna.sessions.v1';
const HIDDEN_SESSIONS_KEY = 'prayatna.hiddenSessions.v1';

interface ApiSubtask {
  id?: number;
  title: string;
  durationSeconds: number;
  order: number;
}

interface ApiTask {
  id?: number;
  title: string;
  durationSeconds: number;
  order: number;
  subtasks?: ApiSubtask[];
}

interface ApiSession {
  id?: number;
  title: string;
  description?: string;
  isPredefined?: boolean;
  durationSeconds?: number;
  totalDuration?: number;
  tasks?: ApiTask[];
}

interface SessionVisibilityResponse {
  sessionId: number;
  isHidden: boolean;
}

@Injectable({ providedIn: 'root' })
export class SessionsService {
  private sessionsSubject = new BehaviorSubject<Session[]>(this.loadLocal());
  readonly sessions$ = this.sessionsSubject.asObservable();
  private readonly baseUrl = environment.apiBaseUrl?.replace(/\/$/, '') || '';

  constructor(private http: HttpClient, private oauth: OAuthService) {
    // Don't auto-refresh here - let components control when to refresh
  }

  isLoggedIn(): boolean {
    try {
      const hasToken = this.oauth.hasValidAccessToken();
      console.log('isLoggedIn check:', hasToken, 'Token:', this.oauth.getAccessToken()?.substring(0, 20));
      return hasToken;
    } catch {
      return false;
    }
  }

  getSnapshot(): Session[] {
    return this.sessionsSubject.getValue();
  }

  async refreshSessions(): Promise<void> {
    console.log('🔄 refreshSessions called, isLoggedIn:', this.isLoggedIn());
    const localSessions = this.loadLocal();
    console.log('📦 Loaded from localStorage:', localSessions.length, localSessions.map(s => s.sessionName + (s.id ? ` (id:${s.id})` : ' (no-id)')));
    
    if (!this.isLoggedIn() || !this.baseUrl) {
      // Not logged in - fetch public predefined sessions and merge with local
      console.log('Not logged in, fetching public predefined sessions...');
      try {
        const publicSessions = await firstValueFrom(this.http.get<ApiSession[]>(`${this.baseUrl}/api/Sessions/public`));
        const mappedPublicSessions = (publicSessions || []).map(dto => this.fromDto(dto));
        console.log('Public sessions received:', mappedPublicSessions.length);
        
        // Merge public predefined with local storage sessions
        const combined = [...mappedPublicSessions, ...localSessions];
        console.log('Combined sessions (public + local):', combined.length);
        this.sessionsSubject.next(combined);
      } catch (err) {
        console.error('Failed to fetch public sessions, showing only local storage', err);
        this.sessionsSubject.next(localSessions);
      }
      return;
    }

    try {
      // Logged in - fetch from API (backend filters hidden sessions)
      console.log('Logged in, fetching from API...');
      const apiSessions = await firstValueFrom(this.http.get<ApiSession[]>(`${this.baseUrl}/api/sessions`, { headers: this.authHeaders() }));
      const mappedApiSessions = (apiSessions || []).map(dto => this.fromDto(dto));
      console.log('API sessions received:', mappedApiSessions.length);
      
      // Merge with local-only sessions (sessions without IDs are local-only)
      const localOnlySessions = localSessions.filter(s => !s.id);
      console.log('📦 Local-only sessions (no IDs):', localOnlySessions.length, localOnlySessions.map(s => s.sessionName));
      const combined = [...mappedApiSessions, ...localOnlySessions];
      console.log('Combined sessions:', combined.length);
      
      this.sessionsSubject.next(combined);
      // Don't save API sessions to local storage - only local-only sessions
      this.saveLocal(localOnlySessions);
      console.log('💾 Saved local-only sessions back to localStorage');
    } catch (err) {
      console.error('Failed to load sessions from API, falling back to local storage', err);
      this.sessionsSubject.next(localSessions);
    }
  }

  async saveSession(session: Session, index?: number, original?: Session): Promise<Session> {
    if (this.isLoggedIn() && this.baseUrl) {
      const dto = this.toDto(session);
      try {
        if (dto.id) {
          await firstValueFrom(this.http.put(`${this.baseUrl}/api/sessions/${dto.id}`, dto, { headers: this.authHeaders() }));
        } else {
          const created = await firstValueFrom(this.http.post<ApiSession>(`${this.baseUrl}/api/sessions`, dto, { headers: this.authHeaders() }));
          session.id = created.id;
        }
        // Don't call refreshSessions here - let the caller (component) decide when to refresh
        // This prevents double API calls when navigating back to the list
        return session;
      } catch (err) {
        console.error('API save failed', err);
        throw err; // Don't save locally when logged in and API fails
      }
    }

    // Local storage path (unauthenticated only)
    const sessions = this.loadLocal();
    let targetIndex = -1;

    if (typeof index === 'number' && index >= 0 && index < sessions.length) {
      targetIndex = index;
    }

    if (targetIndex < 0 && original) {
      const originalSerialized = JSON.stringify(original);
      targetIndex = sessions.findIndex(s => JSON.stringify(s) === originalSerialized);
    }

    if (targetIndex >= 0) {
      sessions[targetIndex] = session;
    } else {
      sessions.push(session);
    }
    this.saveLocal(sessions);
    this.sessionsSubject.next(sessions);
    return session;
  }

  async deleteSession(index: number): Promise<void> {
    const current = this.getSnapshot();
    const target = current[index];
    console.log('🗑️ deleteSession called - index:', index, 'target:', target?.sessionName, 'hasId:', !!target?.id, 'isPredefined:', target?.isPredefined, 'isLoggedIn:', this.isLoggedIn());
    
    if (!target) {
      console.log('❌ No target found at index', index);
      return;
    }

    // Guests can delete only local-only sessions (no id)
    if (!this.isLoggedIn()) {
      console.log('👤 Guest user deletion path');
      if (target.id) {
        throw new Error('This session is synced or system-generated. Please sign in to manage it.');
      }
      // Local-only: remove matching entry from local storage
      const localSessions = this.loadLocal();
      console.log('📦 Local sessions before delete:', localSessions.length);
      const matchIdx = localSessions.findIndex(ls => JSON.stringify(ls) === JSON.stringify(target));
      console.log('🔍 Match index in localStorage:', matchIdx);
      if (matchIdx >= 0) {
        localSessions.splice(matchIdx, 1);
        this.saveLocal(localSessions);
        console.log('✅ Deleted from localStorage, remaining:', localSessions.length);
        const updatedSnapshot = current.filter((_, i) => i !== index);
        this.sessionsSubject.next(updatedSnapshot);
      }
      return;
    }

    // If it's a predefined session, use toggle-visibility API endpoint
    if (target.isPredefined && target.id) {
      console.log('🔒 Predefined session deletion path');
      if (this.isLoggedIn() && this.baseUrl) {
        try {
          await firstValueFrom(this.http.post(`${this.baseUrl}/api/Sessions/${target.id}/toggle-visibility`, {}, { headers: this.authHeaders() }));
          // Remove from current list after successful API call
          const updated = current.filter((_, i) => i !== index);
          this.sessionsSubject.next(updated);
          console.log('✅ Predefined session hidden via API');
          return;
        } catch (err) {
          console.error('API toggle-visibility failed; storing preference locally', err);
          // Fall back to local storage if API fails
          this.hideSession(target.id);
          const updated = current.filter((_, i) => i !== index);
          this.sessionsSubject.next(updated);
          return;
        }
      } else {
        // Guest user trying to delete predefined session - throw error
        throw new Error('Please sign in to hide system-generated sessions from your profile. System-generated sessions cannot be deleted by guest users.');
      }
    }

    if (this.isLoggedIn() && this.baseUrl && target.id) {
      console.log('🌐 API session deletion path');
      try {
        await firstValueFrom(this.http.delete(`${this.baseUrl}/api/sessions/${target.id}`, { headers: this.authHeaders() }));
        // Remove from current list without calling refreshSessions to avoid double fetch
        const updated = current.filter((_, i) => i !== index);
        this.sessionsSubject.next(updated);
        console.log('✅ Deleted from API');
        // Don't update local storage for API sessions
        return;
      } catch (err) {
        console.error('API delete failed; not deleting locally', err);
        throw err;
      }
    }

    // Local-only session deletion (logged in user with local-only session)
    // This happens when a user created a session before login and now wants to delete it
    if (this.isLoggedIn() && !target.id) {
      console.log('💾 Local-only session deletion for logged-in user');
      const localSessions = this.loadLocal();
      console.log('📦 Local sessions before delete:', localSessions.length, localSessions.map(s => s.sessionName));
      const matchIdx = localSessions.findIndex(ls => JSON.stringify(ls) === JSON.stringify(target));
      console.log('🔍 Match index in localStorage:', matchIdx);
      if (matchIdx >= 0) {
        localSessions.splice(matchIdx, 1);
        this.saveLocal(localSessions);
        console.log('✅ Deleted from localStorage, remaining:', localSessions.length, localSessions.map(s => s.sessionName));
      } else {
        console.log('⚠️ Session not found in localStorage');
      }
      // Remove from current snapshot
      const updated = current.filter((_, i) => i !== index);
      console.log('📊 Updated snapshot:', updated.length, updated.map(s => s.sessionName));
      this.sessionsSubject.next(updated);
      return;
    }

    console.log('⚠️ Fallback deletion path');
    // Fallback: Local deletion (unauthenticated or API failed)
    const sessions = this.loadLocal();
    if (index >= 0 && index < sessions.length) {
      sessions.splice(index, 1);
      this.saveLocal(sessions);
      this.sessionsSubject.next(sessions);
      console.log('✅ Deleted via fallback path');
    }
  }

  clearApiSessions(): void {
    // Clear local storage and keep only truly local sessions (those without IDs)
    const localSessions = this.loadLocal().filter(s => !s.id);
    this.saveLocal(localSessions);
    this.sessionsSubject.next(localSessions);
  }

  private getHiddenSessionIds(): number[] {
    try {
      const stored = localStorage.getItem(HIDDEN_SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveHiddenSessionIds(ids: number[]): void {
    try {
      localStorage.setItem(HIDDEN_SESSIONS_KEY, JSON.stringify(ids));
    } catch (err) {
      console.error('Failed to save hidden sessions', err);
    }
  }

  private hideSession(sessionId: number): void {
    const hidden = this.getHiddenSessionIds();
    if (!hidden.includes(sessionId)) {
      hidden.push(sessionId);
      this.saveHiddenSessionIds(hidden);
    }
  }

  exportJson(sessions: Session[]) {
    return JSON.stringify(sessions, null, 2);
  }

  importJson(json: string): Session[] {
    return JSON.parse(json) as Session[];
  }

  private authHeaders(): HttpHeaders {
    const token = this.oauth.getAccessToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return new HttpHeaders(headers);
  }

  private toDto(session: Session): ApiSession {
    return {
      id: session.id,
      title: session.sessionName,
      description: session.description,
      durationSeconds: session.totalDuration || 0,
      isPredefined: false,
      tasks: (session.tasks || []).map((t, idx) => ({
        id: t.id,
        title: t.taskName,
        durationSeconds: t.taskDuration || 0,
        order: idx + 1,
        subtasks: (t.subtasks || []).map((st, sidx) => ({
          id: st.id,
          title: st.subtaskName,
          durationSeconds: st.duration || 0,
          order: st.order || sidx + 1
        }))
      }))
    };
  }

  private fromDto(dto: ApiSession): Session {
    const tasks: Task[] = (dto.tasks || []).map(t => ({
      id: t.id,
      taskName: t.title,
      hasSubtasks: !!(t.subtasks && t.subtasks.length),
      taskDuration: t.durationSeconds || 0,
      order: t.order,
      subtasks: (t.subtasks || []).map(st => ({
        id: st.id,
        subtaskName: st.title,
        duration: st.durationSeconds || 0,
        order: st.order
      }))
    }));

    return {
      id: dto.id,
      sessionName: dto.title,
      description: dto.description,
      isTimed: true,
      totalDuration: (dto.totalDuration ?? dto.durationSeconds) || this.computeTotal(tasks),
      tasks,
      isPredefined: dto.isPredefined || false
    };
  }

  private computeTotal(tasks: Task[]): number {
    return tasks.reduce((acc, t) => {
      if (t.hasSubtasks && t.subtasks?.length) {
        return acc + t.subtasks.reduce((s, st) => s + (st.duration || 0), 0);
      }
      return acc + (t.taskDuration || 0);
    }, 0);
  }

  private loadLocal(): Session[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Session[];
    } catch (e) {
      console.error('Failed to parse sessions from storage', e);
      return [];
    }
  }

  private saveLocal(sessions: Session[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}