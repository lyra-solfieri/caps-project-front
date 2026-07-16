export interface RelatorioCard {
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
  rota?: string;
  tipo: 'grafico' | 'tabela' | 'exportar';
  dados?: any[];
  carregando?: boolean;
}

export interface IndicadoresDesempenho {
  totalPacientes: number;
  totalAgendamentosPeriodo: number;
  agendamentosRealizados: number;
  agendamentosCancelados: number;
  agendamentosPendentes: number;
  totalAtendimentos: number;
  taxaComparecimento: number;
  mediaAtendimentosPorPaciente: number;
}

export interface AtendimentoPorProfissional {
  mes: string;
  quantidade: number;
}
