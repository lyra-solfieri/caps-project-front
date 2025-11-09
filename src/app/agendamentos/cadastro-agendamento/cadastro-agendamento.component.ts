import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { AppFooterComponent } from '../../app-footer/app-footer.component';

@Component({
  selector: 'app-cadastro-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent],
  templateUrl: './cadastro-agendamento.component.html',
  styleUrls: ['./cadastro-agendamento.component.css']
})
export class CadastroAgendamentoComponent {
  agendamento = {
    paciente: '',
    profissional: '',
    data: '',
    hora: '',
    tipo: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Agendamento cadastrado:', this.agendamento);
    alert('Agendamento cadastrado com sucesso!');
    this.router.navigate(['/agendamentos']);
  }

  cancelar() {
    this.router.navigate(['/agendamentos']);
  }
}
