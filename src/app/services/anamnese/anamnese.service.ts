import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnamneseDTO } from './anamnese.model';

@Injectable({
  providedIn: 'root'
})
export class AnamneseService {

  private API = "http://localhost:8080/api/anamneses";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  criarAnamnese(data: AnamneseDTO): Observable<AnamneseDTO> {
    return this.http.post<AnamneseDTO>(this.API, data, {
      headers: this.getHeaders()
    });
  }

  buscarPorId(id: number): Observable<AnamneseDTO> {
    return this.http.get<AnamneseDTO>(`${this.API}/${id}`, {
      headers: this.getHeaders()
    });
  }


  buscarPorPacienteId(pacienteId: number): Observable<AnamneseDTO> {
    return this.http.get<AnamneseDTO>(`${this.API}/paciente/${pacienteId}`, {
      headers: this.getHeaders()
    });
  }

  listarAnamneses(): Observable<AnamneseDTO[]> {
    return this.http.get<AnamneseDTO[]>(this.API, {
      headers: this.getHeaders()
    });
  }

  editarAnamnese(id: number, data: AnamneseDTO): Observable<AnamneseDTO> {
    return this.http.put<AnamneseDTO>(`${this.API}/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  excluirAnamnese(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, {
      headers: this.getHeaders()
    });
  }

}