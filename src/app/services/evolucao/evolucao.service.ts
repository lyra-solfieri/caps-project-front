import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvolucaoDTO } from './evolucao-dto.model';


@Injectable({
  providedIn: 'root'
})
export class EvolucaoService {

  private API = "http://localhost:8080/api/evolucao";

  constructor(private http: HttpClient) {}

  salvar(data: EvolucaoDTO): Observable<EvolucaoDTO> {
    return this.http.post<EvolucaoDTO>(this.API, data);
  }

  atualizar(id: number, data: EvolucaoDTO): Observable<EvolucaoDTO> {
    return this.http.put<EvolucaoDTO>(`${this.API}/${id}`, data);
  }

  buscarPorId(id: number): Observable<EvolucaoDTO> {
    return this.http.get<EvolucaoDTO>(`${this.API}/${id}`);
  }

  listarPorPaciente(pacienteId: number): Observable<EvolucaoDTO[]> {
    return this.http.get<EvolucaoDTO[]>(`${this.API}?pacienteId=${pacienteId}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

}