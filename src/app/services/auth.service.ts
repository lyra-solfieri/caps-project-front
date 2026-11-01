import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';


interface RegisterData {
  email: string;
  password: string;
  nome: string;
  profissao: string;
  role?: 'ADMIN' | 'USER';
}

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth/login`;
  private apiUrlRegister = `${environment.apiUrl}/auth/register`;
  API: any;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  register(userData: RegisterData): Observable<void> {  
    return this.http.post<void>(`${this.apiUrlRegister}`, userData);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return roles.includes(userRole ?? '');
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.name || decoded.sub || null;
  }
}
