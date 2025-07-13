import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edicao-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edicao-agendamento.component.html',
  styleUrls: ['./edicao-agendamento.component.css']
})
export class EdicaoAgendamentoComponent implements OnInit {
  agendamento: any = {
    id: null,
    paciente: '',
    profissional: '',
    data: '',
    hora: '',
    tipo: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.carregarAgendamento(id);
  }

  carregarAgendamento(id: any) {
        const dadosMock = [
      { id: 1, paciente: 'João Silva', profissional: 'Dra. Maria', data: '2025-06-22', hora: '09:00', tipo: 'Psicoterapia' },
      { id: 2, paciente: 'Ana Souza', profissional: 'Dr. Carlos', data: '2025-06-23', hora: '10:30', tipo: 'Fonoaudiologia' },
      { id: 3, paciente: 'Pedro Lima', profissional: 'Enf. Fernanda', data: '2025-06-24', hora: '14:00', tipo: 'Enfermagem' },
    ];

    const encontrado = dadosMock.find(a => a.id == id);

    if (encontrado) {
      this.agendamento = { ...encontrado };
    } else {
      alert('Agendamento não encontrado!');
      this.router.navigate(['/agendamentos']);
    }
  }

  onSubmit() {
    console.log('Agendamento atualizado:', this.agendamento);
    alert('Agendamento atualizado com sucesso!');
    this.router.navigate(['/agendamentos']);
  }

  cancelar() {
    this.router.navigate(['/agendamentos']);
  }
}
