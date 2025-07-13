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
  private apiUrl = 'http://localhost:4200/auth/login';  

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}
