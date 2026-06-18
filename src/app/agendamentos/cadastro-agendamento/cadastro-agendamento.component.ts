import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PacienteService } from '../../services/paciente/paciente.service';
import { SelecionarPacienteModalComponent } from "../../modal/paciente/selecionar-paciente-modal/selecionar-paciente-modal.component";

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [
    CommonModule, AppHeaderComponent, 
    RouterModule, ReactiveFormsModule, 
    SelecionarPacienteModalComponent
  ],
  templateUrl: './cadastro-agendamento.component.html',
  styleUrls: ['./cadastro-agendamento.component.css']
})
export class CadastroAgendamentoComponent implements OnInit {

  agendamentosForm!: FormGroup;
  pacientes: any[] = [];
  mostrarModal = false;
  mostrarDetalheAtendimento = false;
  pacienteSelecionado: any = null;

  constructor(
    private router: Router,
    private agendamentoService: AgendamentoService,
    private pacientesService: PacienteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.agendamentosForm = this.fb.group({
      pacienteId: [null, Validators.required],
      tipoComunicacao: [null, Validators.required],
      destinatario: ['', Validators.required],
      message: [''],
      dataHoraAtendimento: ['']
    });
  }

  salvar(): void {
    if (this.agendamentosForm.invalid) {
      this.agendamentosForm.markAllAsTouched();
      return;
    }

    this.agendamentoService.cadastrarAgendamento(this.agendamentosForm.value)
    .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Agendamento cadastrado!',
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['/agendamentos']);          
        },
        error: ( erro) => {          
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar agendamento'
          });
        }
    })
     
  }

  buscarPaciente(paciente: number) {
     this.pacientesService.buscarPacientePorId(paciente).subscribe({
      next: (paciente: any) => {
        this.pacienteSelecionado = paciente;
      },
      error: (err) => {
        console.error('Erro ao buscar paciente', err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/agendamentos']);
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  onPacienteSelecionado(paciente: number) {
    
    this.pacienteSelecionado = paciente;

    this.agendamentosForm.patchValue({
      pacienteId: paciente
    });

    this.buscarPaciente(paciente);
    this.mostrarModal = false;
    this.mostrarDetalheAtendimento = true;
  }

}
