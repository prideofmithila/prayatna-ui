import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'sessions', loadComponent: () => import('./sessions/sessions-list.component').then(m => m.SessionsListComponent) },
  { path: 'sessions/new', loadComponent: () => import('./sessions/session-form.component').then(m => m.SessionFormComponent) },
  { path: 'sessions/:id/view', loadComponent: () => import('./sessions/session-form.component').then(m => m.SessionFormComponent) },
  { path: 'sessions/:id/edit', loadComponent: () => import('./sessions/session-form.component').then(m => m.SessionFormComponent) },
  { path: 'sessions/:id/timer', loadComponent: () => import('./sessions/session-timer.component').then(m => m.SessionTimerComponent) },
];
