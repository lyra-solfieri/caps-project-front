import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuditoriaService } from '../services/auditoria/auditoria.service';
import { AuditoriaLog, AcaoAuditoria, ACAO_LABELS, ACAO_CORES } from '../services/auditoria/auditoria.model';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css'],
})
export class AuditoriaComponent implements OnInit {
  logs: AuditoriaLog[] = [];
  logSelecionado: AuditoriaLog | null = null;

  pageNo = 0;
  pageSize = 15;
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = false;

  filtroAcao = '';
  filtroEntidade = '';
  filtroUsuario = '';
  filtroDataInicio = '';
  filtroDataFim = '';

  acoesDisponiveis: AcaoAuditoria[] = ['LOGIN', 'LOGOUT', 'CRIACAO', 'ATUALIZACAO', 'EXCLUSAO', 'ACESSO', 'CONFIGURACAO'];
  entidadesDisponiveis = ['PACIENTE', 'AGENDAMENTO', 'EVOLUCAO', 'RAAS', 'ANAMNESE', 'USUARIO'];
  ACAO_LABELS = ACAO_LABELS;
  ACAO_CORES = ACAO_CORES;

  constructor(private service: AuditoriaService) {}

  ngOnInit(): void {
    this.carregarLogs();
  }

  carregarLogs(): void {
    const filtros: any = {};
    if (this.filtroAcao) filtros.acao = this.filtroAcao;
    if (this.filtroEntidade) filtros.entidade = this.filtroEntidade;
    if (this.filtroUsuario) filtros.usuario = this.filtroUsuario;
    if (this.filtroDataInicio) filtros.dataInicio = this.filtroDataInicio + 'T00:00:00';
    if (this.filtroDataFim) filtros.dataFim = this.filtroDataFim + 'T23:59:59';

    this.service.listarLogs(this.pageNo, this.pageSize, filtros).subscribe({
      next: (page) => {
        this.logs = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.isFirst = page.first;
        this.isLast = page.last;
      },
      error: (err) => {
        console.error('Erro ao carregar logs de auditoria:', err);
      },
    });
  }

  aplicarFiltros(): void {
    this.pageNo = 0;
    this.carregarLogs();
  }

  limparFiltros(): void {
    this.filtroAcao = '';
    this.filtroEntidade = '';
    this.filtroUsuario = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.pageNo = 0;
    this.carregarLogs();
  }

  verDetalhe(log: AuditoriaLog): void {
    this.logSelecionado = log;
  }

  fecharDetalhe(): void {
    this.logSelecionado = null;
  }

  proximaPagina(): void {
    if (!this.isLast) {
      this.pageNo++;
      this.carregarLogs();
    }
  }

  paginaAnterior(): void {
    if (!this.isFirst) {
      this.pageNo--;
      this.carregarLogs();
    }
  }

  irParaPagina(pagina: number): void {
    this.pageNo = pagina;
    this.carregarLogs();
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
  }
}
