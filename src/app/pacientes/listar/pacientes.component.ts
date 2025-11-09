import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PacienteService, PacienteDto } from '../../services/paciente/paciente.service';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, RouterModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  pacientes: PacienteDto[] = [];

  constructor(
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (dados) => {
        this.pacientes = dados;
        console.log("🚀 ~ PacientesComponent ~ carregarPacientes ~ this.pacientes:", this.pacientes);
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes:', erro);
      }
    });
  }

  addPaciente(): void {
    this.router.navigate(['/pacientes/cadastro']);
  }

  editarPaciente(paciente: PacienteDto): void {
    this.router.navigate(['/pacientes/editar', paciente.id]);
  }

  excluirPaciente(pacienteId: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Excluir paciente',
      text: 'Tem certeza que deseja excluir o paciente?',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pacienteService.excluirPaciente(pacienteId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Paciente excluído com sucesso!',
              showConfirmButton: false,
              timer: 2000
            });
            this.carregarPacientes();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir paciente',
              text: 'Ocorreu um erro ao excluir o paciente.'
            });
          }
        });
      }
    });
  }

  calcularIdade(dataNascimento: string): number {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

}
