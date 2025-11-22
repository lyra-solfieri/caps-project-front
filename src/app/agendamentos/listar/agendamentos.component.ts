import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { AppFooterComponent } from '../../app-footer/app-footer.component';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
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
        this.agendamentos = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar agendamentos:', erro);
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
   
  }
}

