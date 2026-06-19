import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../../services/paciente/paciente.service';
import { PacienteDto } from '../../../services/paciente/paciente.model';

@Component({
  selector: 'app-selecionar-paciente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selecionar-paciente-modal.component.html',
  styleUrls: ['./selecionar-paciente-modal.component.css']
})
export class SelecionarPacienteModalComponent implements OnInit {
  @Output() fechado = new EventEmitter<void>();
  @Output() selecionado = new EventEmitter<number>();

  termo = '';
  pacientes: PacienteDto[] = [];
  filtrados: PacienteDto[] = [];
  loading = true;

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.loading = true;
    this.pacienteService.listarPacientes(0, 200, 'nome', 'asc').subscribe({
      next: (res) => {
        this.pacientes = res.content;
        this.filtrados = res.content;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const termo = this.termo.toLowerCase().trim();
    if (!termo) {
      this.filtrados = this.pacientes;
      return;
    }
    this.filtrados = this.pacientes.filter(p => {
      const matchNome = p.nome?.toLowerCase().includes(termo);
      const cpfLimpo = p.cpf?.replace(/\D/g, '');
      const termoLimpo = termo.replace(/\D/g, '');
      const matchCpf = termoLimpo.length > 0 ? cpfLimpo?.includes(termoLimpo) : false;
      return matchNome || matchCpf;
    });
  }

  selecionar(paciente: PacienteDto): void {
    this.selecionado.emit(paciente.id);
  }

  fechar(): void {
    this.fechado.emit();
  }
}
