import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Genero } from '../../enums/genero.enum';
import { Raca } from '../../enums/raca.enum';
import { PacienteService } from '../../services/paciente/paciente.service';
import { AppHeaderComponent } from '../../app-header/app-header.component';
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
     AppHeaderComponent,
     NgxMaskDirective
    ],
  providers: [provideNgxMask()],
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
      // Mensagem genérica caso seja um erro 500 ou queda de servidor
      let mensagemErro = 'Ocorreu um erro ao tentar conectar com o servidor.';

      // Agora o backend vai enviar corretamente o status 409
      if (err.status === 400 || err.status === 409) {
        // O Spring Boot envia a mensagem dentro de err.error.message quando usamos ResponseStatusException
        mensagemErro = err.error?.message || err.error || 'Este CPF já está cadastrado no sistema.';
        
        // Marca o input do CPF como inválido para feedback visual no formulário (se você tiver css para isso)
        this.pacienteForm.get('cpf')?.setErrors({ cpfDuplicado: true });
      }

      Swal.fire({
        icon: 'error',
        title: 'Erro no Cadastro', // Título ajustado
        text: typeof mensagemErro === 'string' ? mensagemErro : 'Verifique os dados enviados.'
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
