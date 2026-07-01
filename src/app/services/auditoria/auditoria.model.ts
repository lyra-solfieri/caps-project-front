export type AcaoAuditoria =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CRIACAO'
  | 'ATUALIZACAO'
  | 'EXCLUSAO'
  | 'ACESSO'
  | 'CONFIGURACAO';

export const ACAO_LABELS: Record<AcaoAuditoria, string> = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CRIACAO: 'Criação',
  ATUALIZACAO: 'Atualização',
  EXCLUSAO: 'Exclusão',
  ACESSO: 'Acesso',
  CONFIGURACAO: 'Configuração',
};

export const ACAO_CORES: Record<AcaoAuditoria, string> = {
  LOGIN: '#1976d2',
  LOGOUT: '#666',
  CRIACAO: '#2e7d32',
  ATUALIZACAO: '#f57c00',
  EXCLUSAO: '#d32f2f',
  ACESSO: '#00796b',
  CONFIGURACAO: '#6a1b9a',
};

export interface AuditoriaLog {
  id: number;
  usuario: string;
  acao: AcaoAuditoria;
  entidade: string;
  entidadeId: number | null;
  detalhes: string;
  ip: string;
  dataHora: string;
}

export interface AuditoriaPage {
  content: AuditoriaLog[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
}

export interface AuditoriaFiltros {
  acao?: AcaoAuditoria;
  entidade?: string;
  usuario?: string;
  dataInicio?: string;
  dataFim?: string;
}
