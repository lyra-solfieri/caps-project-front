import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, UpdateUserDto } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `bearer ${token}` });
  }

  getProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`, { headers: this.getHeaders() });
  }

  updateProfile(data: UpdateUserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/me`, data, { headers: this.getHeaders() });
  }

  listarUsuarios(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  listarPorRole(role: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}?role=${role}`, { headers: this.getHeaders() });
  }
}
