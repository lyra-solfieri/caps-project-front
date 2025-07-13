import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edicao-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edicao-paciente.component.html',
  styleUrls: ['./edicao-paciente.component.css']
})
export class EdicaoPacienteComponent implements OnInit {
  paciente: any = {
    id: null,
    nome: '',
    idade: null,
    responsavel: '',
    observacoes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.carregarPaciente(id);
  }

  carregarPaciente(id: any) {
    // Chamar a API para buscar dados do paciente
    // Simulando com dados mockados
    const dadosMock = [
      { id: 1, nome: 'João Silva', idade: 12, responsavel: 'Maria Silva', observacoes: 'Acompanhamento semanal' },
      { id: 2, nome: 'Ana Souza', idade: 15, responsavel: 'Carlos Souza', observacoes: 'Necessita acompanhamento psicopedagógico' },
    ];

    const pacienteEncontrado = dadosMock.find(p => p.id == id);

    if (pacienteEncontrado) {
      this.paciente = { ...pacienteEncontrado };
    } else {
      alert('Paciente não encontrado!');
      this.router.navigate(['/pacientes']);
    }
  }

  onSubmit() {
    console.log('Paciente atualizado:', this.paciente);
    alert('Paciente atualizado com sucesso!');
    this.router.navigate(['/pacientes']);
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
  }
}
