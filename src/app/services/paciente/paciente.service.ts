import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteDto, PageResponse } from './paciente.model';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private readonly apiUrl = 'http://localhost:8080/api/pacientes';

  
  constructor(private http: HttpClient) {}

  
  criarPaciente(paciente: PacienteDto): Observable<any> {
    return this.http.post(this.apiUrl, paciente);    
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

    return this.http.get<PageResponse<PacienteDto>>(this.apiUrl, { params });
  }


  excluirPaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  atualizarPaciente(id: number, paciente: PacienteDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente)
  }

  buscarPacientePorId(id: number): Observable<any> {
   return this.http.get<PacienteDto>(`${this.apiUrl}/${id}`).pipe(
   );
  }
}
