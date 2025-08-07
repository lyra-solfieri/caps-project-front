import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent {
  agendamentos = [
    { id: 1, paciente: 'João Silva', profissional: 'Dra. Maria', data: '2025-06-22', hora: '09:00', tipo: 'Psicoterapia' },
    { id: 2, paciente: 'Ana Souza', profissional: 'Dr. Carlos', data: '2025-06-23', hora: '10:30', tipo: 'Fonoaudiologia' },
    { id: 3, paciente: 'Pedro Lima', profissional: 'Enf. Fernanda', data: '2025-06-24', hora: '14:00', tipo: 'Enfermagem' },
  ];

  constructor(private router: Router) {}

  addAgendamento() {
    this.router.navigate(['/agendamentos/novo']);
  }

  editarAgendamento(agendamento: any) {
    alert(`Editar agendamento ID: ${agendamento.id}`);
    this.router.navigate(['/agendamentos/editar', agendamento.id]);
  }

  excluirAgendamento(agendamento: any) {
    const confirmar = confirm(`Deseja excluir o agendamento de ${agendamento.paciente}?`);
    if (confirmar) {
      this.agendamentos = this.agendamentos.filter(a => a.id !== agendamento.id);
    }
  }
}
