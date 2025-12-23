import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'sessions', loadComponent: () => import('./sessions/sessions-list.component').then(m => m.SessionsListComponent) },
  { path: 'sessions/new', loadComponent: () => import('./sessions/session-form.component').then(m => m.SessionFormComponent) },
  { path: 'sessions/:id/view', loadComponent: () => import('./sessions/session-form.component').then(m => m.SessionFormComponent) },
  { path: 'sessions/:id/edit', loadComponent: () => import('./sessions/session-form.component').then(m => m.SessionFormComponent) },
];
