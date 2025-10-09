import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Genero } from '../../enums/genero.enum';
import { Raca } from '../../enums/raca.enum';
import { PacienteService } from '../../services/paciente/paciente.service';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: ['./cadastro-paciente.component.css']
})
export class CadastroPacienteComponent {
  generos = Object.values(Genero);
  racas = Object.values(Raca);

  pacienteForm: FormGroup;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.pacienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      nomeMae: [''],
      nomePai: [''],
      profissao: [''],
      numeroCartaoSUS: [''],
      raca: ['', Validators.required],
      numeroProntuario: [null],
      infantojuvenil: [false],
      emSituacaoSocioeconomica: [false],
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        logradouro: [''],
        numero: [''],
        complemento: [''],
        bairro: [''],
        cidade: [''],
        estado: [''],
        pais: ['']
      })
    });
  }

  onSubmit() {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Preencha os campos obrigatórios corretamente.'
      });
      return;
    }

    this.pacienteService.criarPaciente(this.pacienteForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Paciente cadastrado!',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/pacientes']);
        });
      },
      error: (err) => {
        console.error('Erro ao cadastrar paciente:', err.error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar paciente',
          text: err.error
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
    Swal.fire({
      icon: 'warning',
      title: 'Cadastro cancelado',
      showConfirmButton: false,
      timer: 2000
    })
  }

  get f() {
    return this.pacienteForm.controls as any;
  }
}
