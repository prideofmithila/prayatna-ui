import { Injectable } from '@angular/core';
import { Session } from './session.model';

const STORAGE_KEY = 'prayatna.sessions.v1';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  load(): Session[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Session[];
    } catch (e) {
      console.error('Failed to parse sessions from storage', e);
      return [];
    }
  }

  save(sessions: Session[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  exportJson(sessions: Session[]) {
    return JSON.stringify(sessions, null, 2);
  }

  importJson(json: string): Session[] {
    return JSON.parse(json) as Session[];
  }
}