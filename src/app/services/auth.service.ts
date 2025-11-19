import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/login';  

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
}
