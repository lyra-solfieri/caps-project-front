import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PacienteService } from '../../services/paciente/paciente.service';
import Swal from 'sweetalert2';
import { PacienteDto } from '../../services/paciente/paciente.model';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
  
})
export class PacientesComponent implements OnInit {
  
  pacientes: PacienteDto[] = [];
  pacientes_s: any[] = [];
  pacientesOriginal: any[] = [];
  pageNo = 0;
  pageSize = 10;

  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = false;

  sortBy = 'nome';
  direction = 'asc';

  constructor(
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService
      .listarPacientes(this.pageNo, this.pageSize, this.sortBy, this.direction)
      .subscribe({
        next: (page) => {
          this.pacientes = page.content;
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
          this.isFirst = page.first;
          this.isLast = page.last;
          this.pacienteService.listarPacientes(0, this.totalElements, this.sortBy, this.direction).subscribe(dados => {
          this.pacientesOriginal = dados.content;
          this.pacientes_s = dados.content;
          });
        },
        error: (erro) => {
          console.error('Erro ao buscar pacientes:', erro);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao buscar pacientes',
            text: 'Ocorreu um erro ao buscar os pacientes.'
          })
        }
      });
  }

  abrirRaas(pacienteId: number) {
    this.router.navigate(['/raas/novo', pacienteId]);
  }

  addPaciente(): void {
    this.router.navigate(['/pacientes/cadastro']);
  }

  editarPaciente(pacienteId: number): void {
    this.router.navigate(['/pacientes/editar',pacienteId]);
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
              text: 'Ocorreu um erro ao excluir o paciente. Verifique se há agendamentos relacionados a este paciente.'
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

  proximaPagina(): void {
    if (!this.isLast) {
      this.pageNo++;
      this.carregarPacientes();
    }
  }

  paginaAnterior(): void {
    if (!this.isFirst) {
      this.pageNo--;
      this.carregarPacientes();
    }
  }

  irParaPagina(pagina: number): void {
    this.pageNo = pagina;
    this.carregarPacientes();
  }

  onSearch(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();

    if (!valor) {
      this.pacientes = [...this.pacientesOriginal];
      return;
    }

    this.pacientes = this.pacientesOriginal.filter(p => {
      const matchNome = p.nome?.toLowerCase().includes(valor) || false;

      const cpfLimpo = p.cpf?.replace(/\D/g, '') || '';
      const termoLimpo = valor.replace(/\D/g, '');

      const matchCpf = termoLimpo.length > 0 ? cpfLimpo.includes(termoLimpo) : false;

      return matchNome || matchCpf;
    });
  }

}
