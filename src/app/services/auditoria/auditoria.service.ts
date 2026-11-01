import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditoriaFiltros, AuditoriaPage } from './auditoria.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private apiUrl = `${environment.apiUrl}/api/auditoria`;

  constructor(private http: HttpClient) {}

  listarLogs(page: number, size: number, filtros?: AuditoriaFiltros): Observable<AuditoriaPage> {
    const params: any = { page, size };
    if (filtros) {
      if (filtros.acao) params.acao = filtros.acao;
      if (filtros.entidade) params.entidade = filtros.entidade;
      if (filtros.usuario) params.usuario = filtros.usuario;
      if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
      if (filtros.dataFim) params.dataFim = filtros.dataFim;
    }
    return this.http.get<AuditoriaPage>(this.apiUrl, { params });
  }

  listarUsuarios(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/usuarios`);
  }

  listarEntidades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/entidades`);
  }
}
