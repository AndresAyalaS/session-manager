import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'session_auth_token';
  private readonly USER_KEY = 'session_user_data';

  // Mock de usuarios para autenticación
  private mockUsers = [
    { id: '1', email: 'admin@sdi.es', password: 'admin123', name: 'Juan Administrador', city: 'Madrid' },
    { id: '2', email: 'maria@sdi.es', password: 'admin123', name: 'María González', city: 'Barcelona' },
    { id: '3', email: 'usuario@gmail.com', password: 'user123', name: 'Carlos Usuario', city: 'Madrid' },
    { id: '4', email: 'ana@hotmail.com', password: 'user123', name: 'Ana López', city: 'Valencia' }
  ];

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => new Error('Credenciales inválidas'));
    }

    const role = user.email.endsWith('@sdi.es') ? 'admin' : 'user';
    const authUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      city: user.city
    };

    const token = this.generateMockToken();
    const response: AuthResponse = { user: authUser, token };

    return of(response).pipe(
      delay(500),
      tap(res => {
        localStorage.setItem(this.STORAGE_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.STORAGE_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user = JSON.parse(userData) as User;
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  private generateMockToken(): string {
    return 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
  }
}
