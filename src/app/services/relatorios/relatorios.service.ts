import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndicadoresDesempenho, AtendimentoPorProfissional } from './relatorios.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  private readonly apiUrl = `${environment.apiUrl}/api/relatorios`;

  constructor(private http: HttpClient) {}

  obterIndicadores(inicio?: string, fim?: string): Observable<IndicadoresDesempenho> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fim) params = params.set('fim', fim);
    return this.http.get<IndicadoresDesempenho>(`${this.apiUrl}/indicadores`, { params });
  }

  obterAtendimentosPorProfissional(inicio?: string, fim?: string): Observable<AtendimentoPorProfissional[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fim) params = params.set('fim', fim);
    return this.http.get<AtendimentoPorProfissional[]>(`${this.apiUrl}/atendimentos/por-profissional`, { params });
  }
}
