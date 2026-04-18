import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RaasRequestDTO, RaasResponseDTO } from './raas.model';



@Injectable({
  providedIn: 'root'
})
export class RaasService {

  private readonly apiUrl = 'http://localhost:8080/api/raas';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `bearer ${token}` });
  }

  criar(raas: RaasRequestDTO): Observable<RaasResponseDTO> {
    return this.http.post<RaasResponseDTO>(this.apiUrl, raas, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<RaasResponseDTO> {
    return this.http.get<RaasResponseDTO>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  listarPorPaciente(pacienteId: number): Observable<RaasResponseDTO[]> {
    return this.http.get<RaasResponseDTO[]>(`${this.apiUrl}/paciente/${pacienteId}`, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  gerarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}
