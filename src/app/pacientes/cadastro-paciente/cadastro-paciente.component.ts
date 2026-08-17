import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Genero } from '../../enums/genero.enum';
import { Raca } from '../../enums/raca.enum';
import { PacienteService } from '../../services/paciente/paciente.service';
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { ViaCepService } from '../../services/paciente/cep.service';

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [
     CommonModule,
     ReactiveFormsModule,
     HttpClientModule,
     NgxMaskDirective
    ],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: ['./cadastro-paciente.component.css']
})
export class CadastroPacienteComponent implements OnInit {

  ngOnInit(): void {
    this.pacienteForm.get('cpf')?.valueChanges.subscribe(() => {
      if (this.pacienteForm.get('cpf')?.hasError('cpfDuplicado')) {
        this.pacienteForm.get('cpf')?.setErrors(null);
        this.pacienteForm.get('cpf')?.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  generos = Object.values(Genero);
  racas = Object.values(Raca);

  pacienteForm: FormGroup;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private fb: FormBuilder,
    private cepService: ViaCepService
  ) {
    this.pacienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cpf: ['', [Validators.required,]],
      rg: [''],
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
      nacionalidade: [''],
      religiao: [''],
      escolaridade: [''],
      etniaIndigena: [''],
      profissaoMae: [''],
      profissaoPai: [''],
      responsavelLegal: [''],
      parentescoResponsavelLegal: [''],
      telefoneResponsavelLegal: [''],
      profissaoResponsavelLegal: [''],
      unidadeBasicaSaude: [''],
      agenteSaude: [''],
      instituicaoEnsino: [''],
      rendaFamiliar: [''],
      auxilioOuBeneficioSocial: [''],
      contextoVulnerabilidadeSocioeconomica: [''],
      codIBGEMunicipio: [''],
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
      return;
    }

    this.pacienteService.criarPaciente(this.pacienteForm.value).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Paciente cadastrado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/pacientes']);
        });
      },

      error: (err: HttpErrorResponse) => {
        let mensagemErro = 'Ocorreu um erro ao validar os dados.';

        if (err.status === 400 || err.status === 409) {
          
          if (typeof err.error === 'string') {
            mensagemErro = err.error;
          } else if (err.error?.message) {
            mensagemErro = err.error.message;
          } else if (err.error && typeof err.error === 'object') {
            mensagemErro = Object.values(err.error).join(' | ');
          }

          const msgMinuscula = String(mensagemErro).toLowerCase();

          if (err.status === 409 || msgMinuscula.includes('cadastrado') || msgMinuscula.includes('duplicado')) {
            this.pacienteForm.get('cpf')?.setErrors({ cpfDuplicado: true });
            mensagemErro = 'Este CPF já está cadastrado no sistema.';
            
          } else if (msgMinuscula.includes('cpf')) {
            this.pacienteForm.get('cpf')?.setErrors({ pattern: true });
          }
          
          document.getElementById('cpf')?.focus();
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro no Cadastro',
          text: mensagemErro
        });
      }
    });
  }

  async buscarCep() {
    const cep = this.pacienteForm.get('endereco.cep')?.value;
    if (cep) {
      this.cepService.buscarCep(cep).subscribe(
        (cepData: any) => {
          this.pacienteForm.patchValue({
            endereco: {
              logradouro: cepData.logradouro,
              complemento: cepData.complemento,
              bairro: cepData.bairro,
              cidade: cepData.localidade,
              estado: cepData.uf,
              pais: "Brasil"
            }
          });
        },
        (error) => {
          console.error('Erro ao buscar CEP:', error);
        }
      );
    }
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

  listaPacientes() {
    this.router.navigate(['/pacientes']);
  }

  get f() {
    return this.pacienteForm.controls as any;
  }
}
