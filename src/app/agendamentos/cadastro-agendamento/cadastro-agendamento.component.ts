import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PacienteService } from '../../services/paciente/paciente.service';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './cadastro-agendamento.component.html',
  styleUrls: ['./cadastro-agendamento.component.css']
})
export class CadastroAgendamentoComponent implements OnInit {

  agendamentosForm!: FormGroup;
  pacientes: any[] = [];

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
      idPaciente: [1],
      tipoComunicacao: [null, Validators.required],
      destinatario: ['', Validators.required],
      message: ['', Validators.required],
      dataHoraAtendimento: ['', Validators.required]
    });
  }

  salvar(): void {
    if (this.agendamentosForm.invalid) {
      this.agendamentosForm.markAllAsTouched();
      return;
    }

    console.log("🚀 ~ CadastroAgendamentoComponent ~ salvar ~ this.agendamentosForm.value:", this.agendamentosForm.value)
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

  listarPacientes(): void {

    this.pacientesService.listarPacientes().subscribe({
      next: (dados) => {
        console.log("🚀 ~ CadastroAgendamentoComponent ~ listarPacientes ~ dados:", dados);
        this.pacientes = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes:', erro);
      }
    })
    
  }

  cancelar(): void {
    this.router.navigate(['/agendamentos']);
  }

}
