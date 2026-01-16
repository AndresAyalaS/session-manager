import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { AdminComponent } from './features/admin/admin.component';
import { SessionFormComponent } from './features/admin/session-form.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'calendario',
    component: CalendarComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/session/:id',
    component: SessionFormComponent,
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '/login' }
];
