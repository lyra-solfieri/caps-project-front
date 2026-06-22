import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuditoriaLog, AuditoriaFiltros, AuditoriaPage } from './auditoria.model';

const MOCK_LOGS: AuditoriaLog[] = [
  { id: 1, usuario: 'admin', acao: 'LOGIN', entidade: '-', entidadeId: null, detalhes: 'Usuário fez login no sistema', ip: '192.168.1.100', dataHora: '2026-06-18T08:30:00' },
  { id: 2, usuario: 'maria.silva', acao: 'CRIACAO', entidade: 'PACIENTE', entidadeId: 42, detalhes: 'Cadastro do paciente João Oliveira', ip: '192.168.1.101', dataHora: '2026-06-18T09:15:00' },
  { id: 3, usuario: 'admin', acao: 'CONFIGURACAO', entidade: 'USUARIO', entidadeId: 5, detalhes: 'Alteração de perfil do usuário pedro.lima para ADMIN', ip: '192.168.1.100', dataHora: '2026-06-18T09:30:00' },
  { id: 4, usuario: 'carla.souza', acao: 'ATUALIZACAO', entidade: 'AGENDAMENTO', entidadeId: 128, detalhes: 'Reagendamento de 20/06 para 25/06 às 14h', ip: '192.168.1.102', dataHora: '2026-06-18T10:00:00' },
  { id: 5, usuario: 'pedro.lima', acao: 'EXCLUSAO', entidade: 'PACIENTE', entidadeId: 38, detalhes: 'Exclusão do paciente Carlos Santos', ip: '192.168.1.103', dataHora: '2026-06-18T10:45:00' },
  { id: 6, usuario: 'maria.silva', acao: 'ACESSO', entidade: 'EVOLUCAO', entidadeId: 15, detalhes: 'Visualização da evolução do paciente 42', ip: '192.168.1.101', dataHora: '2026-06-18T11:00:00' },
  { id: 7, usuario: 'admin', acao: 'LOGOUT', entidade: '-', entidadeId: null, detalhes: 'Usuário fez logout do sistema', ip: '192.168.1.100', dataHora: '2026-06-18T12:00:00' },
  { id: 8, usuario: 'carla.souza', acao: 'CRIACAO', entidade: 'RAAS', entidadeId: 67, detalhes: 'Gerado RAAS mensal para paciente 42', ip: '192.168.1.102', dataHora: '2026-06-17T14:30:00' },
  { id: 9, usuario: 'pedro.lima', acao: 'ATUALIZACAO', entidade: 'PACIENTE', entidadeId: 42, detalhes: 'Atualização de endereço e telefone', ip: '192.168.1.103', dataHora: '2026-06-17T15:00:00' },
  { id: 10, usuario: 'admin', acao: 'LOGIN', entidade: '-', entidadeId: null, detalhes: 'Usuário fez login no sistema', ip: '192.168.1.100', dataHora: '2026-06-17T08:00:00' },
  { id: 11, usuario: 'maria.silva', acao: 'CRIACAO', entidade: 'ANAMNESE', entidadeId: 23, detalhes: 'Registro de anamnese infantil para paciente 50', ip: '192.168.1.101', dataHora: '2026-06-17T09:00:00' },
  { id: 12, usuario: 'carla.souza', acao: 'ATUALIZACAO', entidade: 'AGENDAMENTO', entidadeId: 130, detalhes: 'Cancelamento de agendamento (paciente desistiu)', ip: '192.168.1.102', dataHora: '2026-06-17T11:30:00' },
];

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private apiUrl = 'http://localhost:8080/api/auditoria';

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

  getMockLogs(page: number, size: number, filtros?: AuditoriaFiltros): Observable<AuditoriaPage> {
    let filtered = [...MOCK_LOGS];
    if (filtros) {
      if (filtros.acao) filtered = filtered.filter(l => l.acao === filtros.acao);
      if (filtros.entidade) filtered = filtered.filter(l => l.entidade === filtros.entidade);
      if (filtros.usuario) filtered = filtered.filter(l => l.usuario === filtros.usuario);
      if (filtros.dataInicio) filtered = filtered.filter(l => l.dataHora >= filtros.dataInicio!);
      if (filtros.dataFim) filtered = filtered.filter(l => l.dataHora <= filtros.dataFim!);
    }
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = filtered.slice(start, start + size);
    const pageObj: AuditoriaPage = {
      content,
      totalPages,
      totalElements,
      first: page === 0,
      last: page >= totalPages - 1,
      number: page,
      size,
    };
    return of(pageObj);
  }
}
