import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';
import { Session, Task, Subtask } from './session.model';

const STORAGE_KEY = 'prayatna.sessions.v1';

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
    const localSessions = this.loadLocal();
    
    if (!this.isLoggedIn() || !this.baseUrl) {
      // Not logged in - only show local storage sessions
      console.log('Not logged in, showing local sessions:', localSessions.length);
      this.sessionsSubject.next(localSessions);
      return;
    }

    try {
      // Logged in - fetch from API
      console.log('Logged in, fetching from API...');
      const apiSessions = await firstValueFrom(this.http.get<ApiSession[]>(`${this.baseUrl}/api/sessions`, { headers: this.authHeaders() }));
      const mappedApiSessions = (apiSessions || []).map(dto => this.fromDto(dto));
      console.log('API sessions received:', mappedApiSessions.length);
      
      // Merge with local-only sessions (sessions without IDs are local-only)
      const localOnlySessions = localSessions.filter(s => !s.id);
      const combined = [...mappedApiSessions, ...localOnlySessions];
      console.log('Combined sessions:', combined.length);
      
      this.sessionsSubject.next(combined);
      // Don't save API sessions to local storage - only local-only sessions
      this.saveLocal(localOnlySessions);
    } catch (err) {
      console.error('Failed to load sessions from API, falling back to local storage', err);
      this.sessionsSubject.next(localSessions);
    }
  }

  async saveSession(session: Session, index?: number): Promise<Session> {
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
    if (typeof index === 'number' && index >= 0 && index < sessions.length) {
      sessions[index] = session;
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
    if (!target) return;

    if (this.isLoggedIn() && this.baseUrl && target.id) {
      try {
        await firstValueFrom(this.http.delete(`${this.baseUrl}/api/sessions/${target.id}`, { headers: this.authHeaders() }));
        // Remove from current list without calling refreshSessions to avoid double fetch
        const updated = current.filter((_, i) => i !== index);
        this.sessionsSubject.next(updated);
        // Don't update local storage for API sessions
        return;
      } catch (err) {
        console.error('API delete failed; not deleting locally', err);
        throw err;
      }
    }

    // Local deletion (unauthenticated or API failed)
    const sessions = this.loadLocal();
    if (index >= 0 && index < sessions.length) {
      sessions.splice(index, 1);
      this.saveLocal(sessions);
      this.sessionsSubject.next(sessions);
    }
  }

  clearApiSessions(): void {
    // Clear local storage and keep only truly local sessions (those without IDs)
    const localSessions = this.loadLocal().filter(s => !s.id);
    this.saveLocal(localSessions);
    this.sessionsSubject.next(localSessions);
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
      tasks
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