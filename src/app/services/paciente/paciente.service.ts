import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteDto, PageResponse } from './paciente.model';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private readonly apiUrl = 'http://localhost:8080/api/pacientes';

  
  constructor(private http: HttpClient) {}


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  
  criarPaciente(paciente: PacienteDto): Observable<any> {
    return this.http.post(this.apiUrl, paciente, {headers: this.getHeaders() });    
  }


  listarPacientes(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    direction: string
  ): Observable<PageResponse<PacienteDto>> {

    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get<PageResponse<PacienteDto>>(
      this.apiUrl,
      { headers: this.getHeaders(), params }
    );
  }


  excluirPaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizarPaciente(id: number, paciente: PacienteDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente, { headers: this.getHeaders()})
  }

  buscarPacientePorId(id: number): Observable<any> {
   return this.http.get<PacienteDto>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
