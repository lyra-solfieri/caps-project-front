import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, UpdateUserDto } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`);
  }

  updateProfile(data: UpdateUserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/me`, data);
  }

  listarUsuarios(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  listarPorRole(role: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}?role=${role}`);
  }
}
