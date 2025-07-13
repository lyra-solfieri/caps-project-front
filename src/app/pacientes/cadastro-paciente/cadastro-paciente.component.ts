import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; //RouterLink

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: ['./cadastro-paciente.component.css']
})
export class CadastroPacienteComponent {
  paciente = {
    nome: '',
    idade: null,
    responsavel: '',
    observacoes: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Paciente cadastrado:', this.paciente);
    alert('Paciente cadastrado com sucesso!');
    this.router.navigate(['/pacientes']);
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
  }
}
