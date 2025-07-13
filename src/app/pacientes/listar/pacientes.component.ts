import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {
  pacientes = [
    { id: 1, nome: 'João Silva', idade: 12, responsavel: 'Maria Silva' },
    { id: 2, nome: 'Ana Souza', idade: 15, responsavel: 'Carlos Souza' },
    { id: 3, nome: 'Pedro Lima', idade: 10, responsavel: 'Fernanda Lima' }
  ];

  constructor(private router: Router) {}

  addPaciente() {
    this.router.navigate(['/pacientes/cadastro']);
  }

  editarPaciente(paciente: any) {
    alert(`Editar paciente: ${paciente.nome}`);
    this.router.navigate(['/pacientes/editar', paciente.id]);
  }

  excluirPaciente(paciente: any) {
    const confirmar = confirm(`Deseja excluir ${paciente.nome}?`);
    if (confirmar) {
      this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
    }
  }
}
