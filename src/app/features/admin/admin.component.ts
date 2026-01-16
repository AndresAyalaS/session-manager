import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { Session } from '../../core/models/session.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  sessions: Session[] = [];
  currentUserCity: string = '';

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserCity = user?.city || '';
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
    });
  }

  canDelete(session: Session): boolean {
    return session.city === this.currentUserCity;
  }

  createSession(): void {
    this.router.navigate(['/admin/session/new']);
  }

  editSession(id: string): void {
    this.router.navigate(['/admin/session', id]);
  }

  deleteSession(session: Session): void {
    if (!this.canDelete(session)) {
      alert('Solo puedes eliminar sesiones de tu ciudad (' + this.currentUserCity + ')');
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar "${session.title}"?`)) {
      this.sessionService.deleteSession(session.id).subscribe(() => {
        this.loadSessions();
      });
    }
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'publicado': 'status-published',
      'borrador': 'status-draft',
      'bloqueado': 'status-locked',
      'oculto': 'status-hidden'
    };
    return classes[status] || '';
  }
}
