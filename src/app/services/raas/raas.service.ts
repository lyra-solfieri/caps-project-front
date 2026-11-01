import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RaasPageResponse, RaasRequestDTO, RaasResponseDTO } from './raas.model';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RaasService {

  private readonly apiUrl = `${environment.apiUrl}/api/raas`;

  constructor(private http: HttpClient) {}

  criar(raas: RaasRequestDTO): Observable<RaasResponseDTO> {
    return this.http.post<RaasResponseDTO>(this.apiUrl, raas);
  }

  atualizar(id: number, raas: RaasRequestDTO): Observable<RaasResponseDTO> {
    return this.http.put<RaasResponseDTO>(`${this.apiUrl}/${id}`, raas);
  }

  buscarPorId(id: number): Observable<RaasResponseDTO> {
    return this.http.get<RaasResponseDTO>(`${this.apiUrl}/${id}`);
  }

  listarPorPaciente(pacienteId: number): Observable<RaasResponseDTO[]> {
    return this.http.get<RaasResponseDTO[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  listarPaginado(pageNo: number = 0, pageSize: number = 5): Observable<RaasPageResponse> {
    const params = new HttpParams()
      .set('page', pageNo.toString())
      .set('size', pageSize.toString());
    return this.http.get<RaasPageResponse>(this.apiUrl, { params });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  gerarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
