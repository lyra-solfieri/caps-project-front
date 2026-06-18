import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvolucaoDTO } from './evolucao-dto.model';


@Injectable({
  providedIn: 'root'
})
export class EvolucaoService {

  private API = "http://localhost:8080/api/evolucao";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  salvarEvolucao(data: EvolucaoDTO): Observable<EvolucaoDTO> {
    return this.http.post<EvolucaoDTO>(this.API, data, {
      headers: this.getHeaders()
    });
  }

  atualizarEvolucao(id: number, data: EvolucaoDTO): Observable<EvolucaoDTO> {
    return this.http.post<EvolucaoDTO>(this.API, data, {
      headers: this.getHeaders()
    });
  }

  buscarPorId(id: number): Observable<EvolucaoDTO> {
    return this.http.get<EvolucaoDTO>(`${this.API}/${id}`, {
      headers: this.getHeaders(),
      params: { id: id.toString() }
    });
  }

  listarEvolucoes(page: number, size: number): Observable<EvolucaoDTO[]> {
    return this.http.get<EvolucaoDTO[]>(`${this.API}/listar`, {
      headers: this.getHeaders(),
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  excluirEvolucao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, {
      headers: this.getHeaders()
    });
  }

}