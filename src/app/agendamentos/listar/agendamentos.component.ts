import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import Swal from 'sweetalert2';
import { AgendamentoResponseDto } from '../../services/agendamento/agendamento-response.dto';

@Component({
  selector: 'app-agendamentos', standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agendamentos.component.html', styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent implements OnInit {
  agendamentos: Array<{ id: number; paciente: string; pacienteCpf: string; profissional: string; dataHoraAtendimento: string; tipoComunicacao: string }> = [];
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = false;
  sortBy = 'nome';
  direction = 'asc';

  constructor(private router: Router, private agendamentoService: AgendamentoService) {}

  ngOnInit(): void { this.carregarAgendamentos(); }

  carregarAgendamentos(): void {
    this.agendamentoService.listarAgendamentos(this.pageNo, this.pageSize, this.sortBy, this.direction).subscribe({
      next: (resposta) => {
        const pagina = Array.isArray(resposta) ? null : resposta;
        const itens = Array.isArray(resposta) ? resposta : resposta.content ?? [];

        this.agendamentos = itens.map((agendamento: AgendamentoResponseDto) => ({
          id: agendamento.id,
          paciente: agendamento.paciente?.nome ?? 'Paciente sem nome',
          pacienteCpf: agendamento.paciente?.cpf ?? 'CPF não disponível',
          profissional: agendamento.user?.nome ?? agendamento.user?.email ?? 'Profissional não identificado',
          dataHoraAtendimento: agendamento.dataHoraAtendimento,
          tipoComunicacao: agendamento.tipoComunicacao
        }));
        this.totalPages = pagina?.totalPages ?? 1;
        this.totalElements = pagina?.totalElements ?? itens.length;
        this.isFirst = pagina?.first ?? true;
        this.isLast = pagina?.last ?? true;
      },
      error: () => {
        this.agendamentos = [];
        Swal.fire({ icon: 'error', title: 'Erro ao buscar agendamentos' });
      }
    });
  }

  addAgendamento(): void { this.router.navigate(['/agendamentos/novo']); }
  editarAgendamento(agendamento: { id: number }): void { this.router.navigate(['/agendamentos/editar', agendamento.id]); }

  excluirAgendamento(agendamento: { id: number; paciente: string }): void {
    Swal.fire({ title: 'Tem certeza?', text: `Deseja excluir o agendamento de ${agendamento.paciente}?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sim, excluir', cancelButtonText: 'Cancelar' }).then((result) => {
      if (!result.isConfirmed) return;
      this.agendamentoService.deletarAgendamento(agendamento.id).subscribe({
        next: () => {
          if (this.agendamentos.length === 1 && this.pageNo > 0) this.pageNo--;
          this.carregarAgendamentos();
        },
        error: () => Swal.fire({ icon: 'error', title: 'Erro ao excluir agendamento' })
      });
    });
  }

  proximaPagina(): void { if (!this.isLast) { this.pageNo++; this.carregarAgendamentos(); } }
  paginaAnterior(): void { if (!this.isFirst) { this.pageNo--; this.carregarAgendamentos(); } }
  irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages && pagina !== this.pageNo) { this.pageNo = pagina; this.carregarAgendamentos(); }
  }
}
