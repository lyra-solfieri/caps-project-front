import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SelecionarPacienteModalComponent } from "../modal/paciente/selecionar-paciente-modal/selecionar-paciente-modal.component";
import { EvolucaoService } from '../services/evolucao/evolucao.service';
import { PacienteService } from '../services/paciente/paciente.service';
import { EvolucaoDTO } from '../services/evolucao/evolucao-dto.model';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evolucao',
  templateUrl: './evolucao.component.html',
  styleUrls: ['./evolucao.component.css'],
  imports: [ReactiveFormsModule, CommonModule, SelecionarPacienteModalComponent]
})
export class EvolucaoComponent implements OnInit {
  evolucoes: EvolucaoDTO[] = [];
  evolucaoEmEdicao: EvolucaoDTO | null = null;
  evolucaoForm: FormGroup;
  mostrarModal = false;
  exibirCriarEvolucao = false;
  loading = false;
  error = '';

  pacienteId?: number;
  pacienteNome?: string;
  pacienteSelecionado = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private evolucaoService: EvolucaoService,
    private pacienteService: PacienteService,
    private authService: AuthService
  ) {
    this.evolucaoForm = this.fb.group({
      texto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['pacienteId'];
      if (id) {
        this.pacienteId = Number(id);
        this.pacienteSelecionado = true;
        this.carregarPaciente();
        this.carregarEvolucoes();
      }
    });
  }

  get texto() { return this.evolucaoForm.get('texto'); }

  carregarPaciente(): void {
    if (!this.pacienteId) return;
    this.pacienteService.buscarPacientePorId(this.pacienteId).subscribe({
      next: (p) => this.pacienteNome = p.nome,
      error: () => this.pacienteNome = 'Paciente'
    });
  }

  carregarEvolucoes(): void {
    if (!this.pacienteId) return;
    this.loading = true;
    this.error = '';
    this.evolucaoService.listarPorPaciente(this.pacienteId).subscribe({
      next: (data) => {
        this.evolucoes = data.sort((a, b) => {
          const dateA = a.dataHoraEdicao ? new Date(a.dataHoraEdicao).getTime() : 0;
          const dateB = b.dataHoraEdicao ? new Date(b.dataHoraEdicao).getTime() : 0;
          return dateB - dateA;
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar evoluções'
        });
      }
    });
  }

  onPacienteSelecionado(id: number): void {
    this.mostrarModal = false;
    this.pacienteId = id;
    this.pacienteSelecionado = true;
    this.exibirCriarEvolucao = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pacienteId: id },
      queryParamsHandling: 'merge'
    });
    this.carregarPaciente();
    this.carregarEvolucoes();
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  abrirFormulario(): void {
    if (!this.pacienteSelecionado) {
      this.mostrarModal = true;
      return;
    }
    this.exibirCriarEvolucao = true;
  }

  editarEvolucao(evolucao: EvolucaoDTO, event: Event): void {
    event.stopPropagation();
    this.evolucaoEmEdicao = { ...evolucao };
    this.evolucaoForm.patchValue({ texto: evolucao.texto });
    this.exibirCriarEvolucao = true;
  }

  excluirEvolucao(evolucao: EvolucaoDTO, event: Event): void {
    event.stopPropagation();
    if (!evolucao.id) return;

    Swal.fire({
      icon: 'warning',
      title: 'Excluir evolução',
      text: 'Tem certeza que deseja excluir esta evolução?',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.evolucaoService.excluir(evolucao.id || 0).subscribe({
          next: () => {
            this.evolucoes = this.evolucoes.filter(e => e.id !== evolucao.id);
            if (this.evolucaoEmEdicao?.id === evolucao.id) {
              this.cancelarEdicao();
            }
            Swal.fire({
              icon: 'success',
              title: 'Evolução excluída com sucesso!',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir evolução'
            });
          }
        });
      }
    });
  }

  salvarEvolucao(): void {
    if (!this.evolucaoForm.valid || !this.pacienteId) return;

    const data: EvolucaoDTO = {
      texto: this.evolucaoForm.value.texto,
      pacienteId: this.pacienteId,
      nomeProfissional: this.authService.getUserName() || undefined
    };

    if (this.evolucaoEmEdicao && this.evolucaoEmEdicao.id) {
      data.id = this.evolucaoEmEdicao.id;
      this.evolucaoService.atualizar(this.evolucaoEmEdicao.id, data).subscribe({
        next: () => {
          this.cancelarEdicao();
          this.carregarEvolucoes();
          Swal.fire({
            icon: 'success',
            title: 'Evolução atualizada com sucesso!',
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar evolução'
          });
        }
      });
    } else {
      this.evolucaoService.salvar(data).subscribe({
        next: () => {
          this.cancelarEdicao();
          this.carregarEvolucoes();
          Swal.fire({
            icon: 'success',
            title: 'Evolução cadastrada com sucesso!',
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao salvar evolução'
          });
        }
      });
    }
  }

  selecionarOutroPaciente(): void {
    this.mostrarModal = true;
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }

  cancelarEdicao(): void {
    this.evolucaoEmEdicao = null;
    this.evolucaoForm.reset();
    this.exibirCriarEvolucao = false;
  }
}