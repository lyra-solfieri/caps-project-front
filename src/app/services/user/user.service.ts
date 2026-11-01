import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, UpdateUserDto } from './user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/api/usuarios`;

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
}
