import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RaasRequestDTO, RaasResponseDTO } from './raas.model';



@Injectable({
  providedIn: 'root'
})
export class RaasService {

  private readonly apiUrl = 'http://localhost:8080/api/raas';

  constructor(private http: HttpClient) {}

  criar(raas: RaasRequestDTO): Observable<RaasResponseDTO> {
    return this.http.post<RaasResponseDTO>(this.apiUrl, raas);
  }

  buscarPorId(id: number): Observable<RaasResponseDTO> {
    return this.http.get<RaasResponseDTO>(`${this.apiUrl}/${id}`);
  }

  listarPorPaciente(pacienteId: number): Observable<RaasResponseDTO[]> {
    return this.http.get<RaasResponseDTO[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  listarPaginado(): Observable<RaasResponseDTO[]> {
    return this.http.get<RaasResponseDTO[]>(`${this.apiUrl}/ultimos`);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  gerarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
