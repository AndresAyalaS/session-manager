import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Session, SessionFilter } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionsSubject = new BehaviorSubject<Session[]>([]);
  public sessions$ = this.sessionsSubject.asObservable();

  private readonly STORAGE_KEY = 'sessions_data';

  constructor() {
    this.loadSessions();
  }

  getSessions(): Observable<Session[]> {
    return of(this.sessionsSubject.value).pipe(delay(300));
  }

  getSessionById(id: string): Observable<Session | undefined> {
    const session = this.sessionsSubject.value.find(s => s.id === id);
    return of(session).pipe(delay(200));
  }

  createSession(session: Omit<Session, 'id'>): Observable<Session> {
    const newSession: Session = {
      ...session,
      id: this.generateId()
    };

    const sessions = [...this.sessionsSubject.value, newSession];
    this.updateSessions(sessions);

    return of(newSession).pipe(delay(300));
  }

  updateSession(id: string, session: Partial<Session>): Observable<Session> {
    const sessions = this.sessionsSubject.value.map(s =>
      s.id === id ? { ...s, ...session } : s
    );

    this.updateSessions(sessions);

    const updatedSession = sessions.find(s => s.id === id)!;
    return of(updatedSession).pipe(delay(300));
  }

  deleteSession(id: string): Observable<boolean> {
    const sessions = this.sessionsSubject.value.filter(s => s.id !== id);
    this.updateSessions(sessions);

    return of(true).pipe(delay(300));
  }

  filterSessions(filter: SessionFilter): Session[] {
    let filtered = this.sessionsSubject.value;

    if (filter.category) {
      filtered = filtered.filter(s => s.category === filter.category);
    }

    if (filter.status) {
      filtered = filtered.filter(s => s.status === filter.status);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  private loadSessions(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored) {
      try {
        const sessions = JSON.parse(stored);
        // Convertir las fechas de string a Date
        sessions.forEach((s: Session) => {
          s.dateTime = new Date(s.dateTime);
        });
        this.sessionsSubject.next(sessions);
      } catch (error) {
        this.initializeMockSessions();
      }
    } else {
      this.initializeMockSessions();
    }
  }

  private updateSessions(sessions: Session[]): void {
    this.sessionsSubject.next(sessions);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  private initializeMockSessions(): void {
    const mockSessions: Session[] = [
      {
        id: '1',
        title: 'Visita guiada al Team Building',
        description: 'Actividad de team building para mejorar la cohesión del equipo',
        category: 'Workshop',
        city: 'Madrid',
        dateTime: new Date(2026, 0, 3, 10, 30), // 3 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      },
      {
        id: '2',
        title: 'Teatro "Inmaculados"',
        description: 'Presentación de teatro corporativo',
        category: 'Demo',
        city: 'Madrid',
        dateTime: new Date(2026, 0, 7, 19, 30), // 7 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      },
      {
        id: '3',
        title: 'Visita guiada al Team Building',
        description: 'Segunda sesión de team building',
        category: 'Workshop',
        city: 'Madrid',
        dateTime: new Date(2026, 0, 10, 10, 0), // 10 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      },
      {
        id: '4',
        title: 'Teatro "Inmaculados"',
        description: 'Sesión de teatro',
        category: 'Demo',
        city: 'Barcelona',
        dateTime: new Date(2026, 0, 13, 19, 0), // 13 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      },
      {
        id: '5',
        title: 'Teatro "Inmaculados"',
        description: 'Representación teatral corporativa',
        category: 'Demo',
        city: 'Madrid',
        dateTime: new Date(2026, 0, 17, 19, 30), // 17 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      },
      {
        id: '6',
        title: 'Bailes regionales',
        description: 'Taller de bailes tradicionales',
        category: 'Formación',
        city: 'Valencia',
        dateTime: new Date(2026, 0, 21, 11, 0), // 21 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      },
      {
        id: '7',
        title: 'Teatro "Inmaculados"',
        description: 'Última sesión del mes',
        category: 'Demo',
        city: 'Madrid',
        dateTime: new Date(2026, 0, 22, 20, 30), // 22 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      },
      {
        id: '8',
        title: 'Teatro "Inmaculados"',
        description: 'Representación especial',
        category: 'Demo',
        city: 'Madrid',
        dateTime: new Date(2026, 0, 27, 19, 30), // 27 Enero 2026
        status: 'publicado',
        createdBy: 'admin@sdi.es'
      }
    ];

    this.updateSessions(mockSessions);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
