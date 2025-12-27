import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './cadastro-agendamento.component.html',
  styleUrls: ['./cadastro-agendamento.component.css']
})
export class CadastroAgendamentoComponent implements OnInit {

  agendamentosForm!: FormGroup;

  constructor(
    private router: Router,
    private agendamentoService: AgendamentoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.agendamentosForm = this.fb.group({
      pacienteId: [null, Validators.required],
      userId: [null, Validators.required],
      tipoComunicacao: [null, Validators.required],
      destinatario: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  salvar(): void {
    if (this.agendamentosForm.invalid) {
      this.agendamentosForm.markAllAsTouched();
      return;
    }

    // this.agendamentoService
    //   .criarAgendamento(this.agendamentosForm.value)
    //   .subscribe({
    //     next: () => this.router.navigate(['/agendamentos']),
    //     error: err => console.error('Erro ao cadastrar agendamento', err)
    //   });
  }

  cancelar(): void {
    this.router.navigate(['/agendamentos']);
  }

}
