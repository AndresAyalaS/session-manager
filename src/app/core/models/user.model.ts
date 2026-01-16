export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  city?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
