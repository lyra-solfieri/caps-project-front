import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RelatorioCard {
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
  rota?: string;
  tipo: 'grafico' | 'tabela' | 'exportar';
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
})
export class RelatoriosComponent {
  cards: RelatorioCard[] = [
    {
      titulo: 'Pacientes Cadastrados',
      descricao: 'Relatório completo de todos os pacientes cadastrados, com dados demográficos e contato.',
      icone: 'fas fa-users',
      cor: '#00796b',
      tipo: 'tabela',
    },
    {
      titulo: 'Agendamentos',
      descricao: 'Relatório de agendamentos por período, profissional e status (confirmado, cancelado, realizado).',
      icone: 'fas fa-calendar-check',
      cor: '#1976d2',
      tipo: 'tabela',
    },
    {
      titulo: 'Atendimentos Realizados',
      descricao: 'Quantitativo de atendimentos por profissional, mês e tipo de procedimento.',
      icone: 'fas fa-stethoscope',
      cor: '#2e7d32',
      tipo: 'grafico',
    },
    {
      titulo: 'RAAS Gerados',
      descricao: 'Relatório de RAAS emitidos por paciente e período, com situação de envio.',
      icone: 'fas fa-file-medical',
      cor: '#e65100',
      tipo: 'tabela',
    },
    {
      titulo: 'Evoluções por Paciente',
      descricao: 'Histórico de evoluções registradas para cada paciente com data e profissional.',
      icone: 'fas fa-notes-medical',
      cor: '#6a1b9a',
      tipo: 'tabela',
    },
    {
      titulo: 'Anamneses Infantis',
      descricao: 'Relação de acolhimentos/ anamneses infantis realizadas no período.',
      icone: 'fas fa-child',
      cor: '#c62828',
      tipo: 'tabela',
    },
    {
      titulo: 'Indicadores de Desempenho',
      descricao: 'Taxa de comparecimento, cancelamentos, média de atendimentos por paciente e satisfação.',
      icone: 'fas fa-chart-line',
      cor: '#1565c0',
      tipo: 'grafico',
    },
    {
      titulo: 'Exportar Dados',
      descricao: 'Exporte relatórios em formato CSV ou PDF para análise externa.',
      icone: 'fas fa-file-export',
      cor: '#37474f',
      tipo: 'exportar',
    },
  ];

  gerarRelatorio(card: RelatorioCard): void {
    const msg = `Relatório "${card.titulo}" será implementado com os dados do backend.`;
    alert(msg);
  }
}
