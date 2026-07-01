import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import { PacienteService } from '../../services/paciente/paciente.service';
import { SelecionarPacienteModalComponent } from '../../modal/paciente/selecionar-paciente-modal/selecionar-paciente-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edicao-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SelecionarPacienteModalComponent
  ],
  templateUrl: './edicao-agendamento.component.html',
  styleUrls: ['./edicao-agendamento.component.css']
})
export class EdicaoAgendamentoComponent implements OnInit {
  agendamentoForm!: FormGroup;
  mostrarModal = false;
  pacienteSelecionado: any = null;
  agendamentoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
       this.agendamentoId = Number(id);
       this.carregarAgendamento(this.agendamentoId);
    }
  }

  private criarFormulario(): void {
    this.agendamentoForm = this.fb.group({
      pacienteId: [null, Validators.required],
      tipoComunicacao: ['', Validators.required],
      destinatario: ['', Validators.required],
      message: [''],
      dataHoraAtendimento: ['', Validators.required]
    });
  }

  carregarAgendamento(id: number): void {
    this.agendamentoService.listarAgendamentPorId(id).subscribe({
      next: (agendamento: any) => {
        let dataFormatada = '';
        if (agendamento.dataHoraAtendimento) {
          dataFormatada = agendamento.dataHoraAtendimento.substring(0, 16);
        }

        if (agendamento.paciente) {
          this.pacienteSelecionado = agendamento.paciente;
        }
        this.agendamentoForm.patchValue({
          pacienteId: agendamento.paciente?.id,
          tipoComunicacao: agendamento.tipoComunicacao,
          destinatario: agendamento.destinatario,
          message: agendamento.message,
          dataHoraAtendimento: dataFormatada
        });
       
      },
      error: () => {
        //Swal.fire({ icon: 'error', title: 'Acesso Negado (403)', text: 'Verifique as permissões no Backend!' });
        Swal.fire({ icon: 'error', title: 'Agendamento não encontrado!' });
        this.router.navigate(['/agendamentos']);
      }
    });
  }

  buscarPaciente(pacienteId: number): void {
    this.pacienteService.buscarPacientePorId(pacienteId).subscribe({
      next: (paciente: any) => {
        this.pacienteSelecionado = paciente;
      },
      error: (err) => {
        console.error('Erro ao buscar paciente', err);
      }
    });
  }

  onPacienteSelecionado(paciente: any): void {
    this.pacienteSelecionado = paciente;
    this.agendamentoForm.patchValue({ pacienteId: paciente });
    this.buscarPaciente(paciente);
    this.mostrarModal = false;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  salvar(): void {
    if (this.agendamentoForm.invalid || !this.agendamentoId) {
      this.agendamentoForm.markAllAsTouched();
      return;
    }

    this.agendamentoService.atualizarAgendamento(this.agendamentoId, this.agendamentoForm.value)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Agendamento atualizado!',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['/agendamentos']);
          });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Erro ao atualizar agendamento' });
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/agendamentos']);
  }
}