import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndicadoresDesempenho, AtendimentoPorProfissional } from './relatorios.model';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  private readonly apiUrl = 'http://localhost:8080/api/relatorios';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  obterIndicadores(inicio?: string, fim?: string): Observable<IndicadoresDesempenho> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fim) params = params.set('fim', fim);
    return this.http.get<IndicadoresDesempenho>(`${this.apiUrl}/indicadores`, {
      headers: this.getHeaders(),
      params
    });
  }

  obterAtendimentosPorProfissional(inicio?: string, fim?: string): Observable<AtendimentoPorProfissional[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fim) params = params.set('fim', fim);
    return this.http.get<AtendimentoPorProfissional[]>(`${this.apiUrl}/atendimentos/por-profissional`, {
      headers: this.getHeaders(),
      params
    });
  }
}
