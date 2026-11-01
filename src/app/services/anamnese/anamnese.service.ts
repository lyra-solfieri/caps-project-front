import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnamneseDTO } from './anamnese.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnamneseService {

  private API = `${environment.apiUrl}/api/anamneses`;

  constructor(private http: HttpClient) {}

  criarAnamnese(data: AnamneseDTO): Observable<AnamneseDTO> {
    return this.http.post<AnamneseDTO>(this.API, data);
  }

  buscarPorId(id: number): Observable<AnamneseDTO> {
    return this.http.get<AnamneseDTO>(`${this.API}/${id}`);
  }


  buscarPorPacienteId(pacienteId: number): Observable<AnamneseDTO> {
    return this.http.get<AnamneseDTO>(`${this.API}/paciente/${pacienteId}`);
  }

  listarAnamneses(page: number,size: number): Observable<AnamneseDTO[]> {
    return this.http.get<AnamneseDTO[]>(this.API);
  }

  editarAnamnese(id: number, data: AnamneseDTO): Observable<AnamneseDTO> {
    return this.http.put<AnamneseDTO>(`${this.API}/${id}`, data);
  }

  excluirAnamnese(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

}