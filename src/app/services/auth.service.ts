import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterData {
  username: string;
  password: string;
  email?: string; // Add other fields as required
}
import { jwtDecode } from 'jwt-decode';

interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/login';
  private apiUrlRegister = 'http://localhost:8080/auth/register';
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

  // Seu método de registro
  register(userData: RegisterData): Observable<void> {
    // O retorno é void ou qualquer retorno que seu back envie (ResponseEntity.ok().build())
    return this.http.post<void>(`${this.apiUrlRegister}`, userData);
  }
  // Dentro do AuthService
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const decoded: any = jwtDecode(token);
    // O nome do campo depende de como você configurou o Claims no seu TokenService.java
    return decoded.role; 
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }
}
