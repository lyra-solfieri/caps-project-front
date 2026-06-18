import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { AppFooterComponent } from '../../app-footer/app-footer.component';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, RouterModule],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent {
  
  agendamentos: any[] = [];

  constructor(private router: Router,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

 carregarAgendamentos() {
  this.agendamentoService.listarAgendamentos().subscribe({
    next: (dados) => {
      console.log("🚀 ~ AgendamentosComponent ~ carregarAgendamentos ~ dados:", dados);
      this.agendamentos = dados.map((a: any) => ({
        id: a.id,
        paciente: a.paciente?.nome ?? '-',
        profissional: a.profissional?.nome ?? '-',
        dataHoraAtendimento: a.dataHoraAtendimento,
        tipoComunicacao: a.tipoComunicacao,
        statusAgendamento: a.statusAgendamento
      }));
    }
  });
}

  addAgendamento() {
    this.router.navigate(['/agendamentos/novo']);
  }

  editarAgendamento(agendamento: any) {
    this.router.navigate(['/agendamentos/editar', agendamento.id]);
  }

  excluirAgendamento(agendamento: any) {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja excluir o agendamento de ${agendamento.paciente.nome ?? '-'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.agendamentoService.deletarAgendamento(agendamento.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Excluído!',
              showConfirmButton: false,
              timer: 2000
            });
            this.carregarAgendamentos();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir agendamento'
            });
          }
        });
      }
    });
  }
}

