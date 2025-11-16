import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { PacienteDto, PacienteService } from '../../services/paciente/paciente.service';
import { AppHeaderComponent } from "../../app-header/app-header.component";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { Genero } from '../../enums/genero.enum';
import { Raca } from '../../enums/raca.enum';

@Component({
  selector: 'app-edicao-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './edicao-paciente.component.html',
  styleUrls: ['./edicao-paciente.component.css']
})
export class EdicaoPacienteComponent implements OnInit {

  pacienteForm!: FormGroup;
  generos = Object.values(Genero);
  racas = Object.values(Raca);
  pacienteId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.criarFormulario();
    // this.carregarPaciente(this.pacienteId);
  }

  criarFormulario() {
    this.pacienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      nomeMae: [''],
      nomePai: [''],
      profissao: [''],
      numeroCartaoSUS: [''],
      raca: ['', Validators.required],
      numeroProntuario: [''],
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

  carregarPaciente(id: number) {
    this.pacienteService.buscarPacientePorId(id).subscribe({
      next: (paciente: PacienteDto) => {
        this.pacienteForm.patchValue(paciente);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar paciente'
        });
        this.router.navigate(['/pacientes']);
      }
    });
  }

  onSubmit() {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Verifique os campos obrigatórios.'
      });
      return;
    }

    this.pacienteService.atualizarPaciente(this.pacienteId, this.pacienteForm.value)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Paciente atualizado!',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['/pacientes']);
          });
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar paciente',
            text: err.error.message
          });
        }
      });
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
  }

  get f() {
    return this.pacienteForm.controls as any;
  }
}
