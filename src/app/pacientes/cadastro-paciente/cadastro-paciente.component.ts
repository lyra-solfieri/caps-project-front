import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Genero } from '../../enums/genero.enum';
import { Raca } from '../../enums/raca.enum';
import { PacienteService } from '../../services/paciente/paciente.service';
import { AppFooterComponent } from '../../app-footer/app-footer.component';
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
  // Toda vez que o usuário alterar o valor do CPF, limpamos o erro de duplicidade
  this.pacienteForm.get('cpf')?.valueChanges.subscribe(() => {
    if (this.pacienteForm.get('cpf')?.hasError('cpfDuplicado')) {
      // Remove apenas o erro de duplicação, mantendo pattern/required intactos
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
      this.pacienteForm.markAllAsTouched(); // Dá feedback visual em todos os campos vazios
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
          
          // 1. Extração robusta da mensagem (o Spring Boot pode mandar um JSON com a lista de campos inválidos)
          if (typeof err.error === 'string') {
            mensagemErro = err.error;
          } else if (err.error?.message) {
            mensagemErro = err.error.message;
          } else if (err.error && typeof err.error === 'object') {
            // Se vier um objeto { cpf: "inválido" }, extraímos os valores
            mensagemErro = Object.values(err.error).join(' | ');
          }

          const msgMinuscula = String(mensagemErro).toLowerCase();

          // 2. Classifica se é duplicado ou apenas formato inválido
          if (err.status === 409 || msgMinuscula.includes('cadastrado') || msgMinuscula.includes('duplicado')) {
            // Cenário A: É realmente um CPF duplicado
            this.pacienteForm.get('cpf')?.setErrors({ cpfDuplicado: true });
            mensagemErro = 'Este CPF já está cadastrado no sistema.';
            
          } else if (msgMinuscula.includes('cpf')) {
            // Cenário B: O backend barrou a matemática do CPF (Erro 400)
            // Reutilizamos o erro 'pattern' para ativar a sua tag <small> de "CPF inválido" no HTML
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
