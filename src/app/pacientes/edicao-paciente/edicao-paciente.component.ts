import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { PacienteService } from '../../services/paciente/paciente.service';
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { Genero } from '../../enums/genero.enum';
import { Raca } from '../../enums/raca.enum';
import { ViaCepService } from '../../services/paciente/cep.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-edicao-paciente',
    standalone: true,
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskDirective,
      ],
    providers: [provideNgxMask()],
    templateUrl: './edicao-paciente.component.html',
    styleUrls: ['./edicao-paciente.component.css']
})

export class EdicaoPacienteComponent implements OnInit {

  pacienteForm!: FormGroup;
  generos = Object.values(Genero);
  racas = Object.values(Raca);
  pacienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private cepService: ViaCepService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
        if (idParam) {
          this.pacienteId = Number(idParam);
          this.carregarPaciente(this.pacienteId);
        } else {
          this.pacienteId = null;
        }
    });

  }

  criarFormulario() {
    this.pacienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      rg: [''],
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

  carregarPaciente(id: number): void {
    this.pacienteService.buscarPacientePorId(id).subscribe({
      next: (paciente: any) => {
        
        let dataFormatada = '';
        if (paciente.dataNascimento) {
          dataFormatada = paciente.dataNascimento.substring(0, 10);
        }

        // 2. Sanitiza e mapeia explicitamente os campos retornados pela API
        if (paciente.endereco && paciente.endereco.cep) {
          paciente.endereco.cep = String(paciente.endereco.cep).replace(/\D/g, '');
        }

        const mappedPaciente: any = {
          nome: paciente.nome ?? '',
          email: paciente.email ?? '',
          telefone: paciente.telefone ?? '',
          cpf: paciente.cpf ?? '',
          rg: paciente.rg ?? '',
          dataNascimento: dataFormatada,
          genero: paciente.genero ?? '',
          nomeMae: paciente.nomeMae ?? '',
          nomePai: paciente.nomePai ?? '',
          profissao: paciente.profissao ?? '',
          numeroCartaoSUS: paciente.numeroCartaoSUS ?? '',
          raca: paciente.raca ?? '',
          numeroProntuario: paciente.numeroProntuario ?? '',
          infantojuvenil: !!paciente.infantojuvenil,
          emSituacaoSocioeconomica: !!paciente.emSituacaoSocioeconomica,
          nacionalidade: paciente.nacionalidade ?? '',
          religiao: paciente.religiao ?? '',
          escolaridade: paciente.escolaridade ?? '',
          etniaIndigena: paciente.etniaIndigena ?? '',
          profissaoMae: paciente.profissaoMae ?? '',
          profissaoPai: paciente.profissaoPai ?? '',
          responsavelLegal: paciente.responsavelLegal ?? '',
          parentescoResponsavelLegal: paciente.parentescoResponsavelLegal ?? '',
          telefoneResponsavelLegal: paciente.telefoneResponsavelLegal ?? '',
          profissaoResponsavelLegal: paciente.profissaoResponsavelLegal ?? '',
          unidadeBasicaSaude: paciente.unidadeBasicaSaude ?? '',
          agenteSaude: paciente.agenteSaude ?? '',
          instituicaoEnsino: paciente.instituicaoEnsino ?? '',
          rendaFamiliar: paciente.rendaFamiliar ?? '',
          auxilioOuBeneficioSocial: paciente.auxilioOuBeneficioSocial ?? '',
          contextoVulnerabilidadeSocioeconomica: paciente.contextoVulnerabilidadeSocioeconomica ?? '',
          codIBGEMunicipio: paciente.codIBGEMunicipio ?? ''
        };

        const mappedEndereco: any = {
          cep: paciente.endereco?.cep ?? '',
          logradouro: paciente.endereco?.logradouro ?? '',
          numero: paciente.endereco?.numero ?? '',
          complemento: paciente.endereco?.complemento ?? '',
          bairro: paciente.endereco?.bairro ?? '',
          cidade: paciente.endereco?.cidade ?? paciente.endereco?.localidade ?? '',
          estado: paciente.endereco?.estado ?? paciente.endereco?.uf ?? '',
          pais: paciente.endereco?.pais ?? 'Brasil'
        };

        this.pacienteForm.patchValue(mappedPaciente);
        this.pacienteForm.get('endereco')?.patchValue(mappedEndereco);

      },
      error: () => {
        Swal.fire('Erro', 'Paciente não encontrado', 'error');
        this.router.navigate(['/pacientes']);
      }
      
    });
  }

  onSubmit(): void {

    if (this.pacienteForm.invalid || !this.pacienteId) {
      this.pacienteForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Verifique os campos obrigatórios.'
      });
      return;
    }

    const payload = this.pacienteForm.getRawValue();

    this.pacienteService.atualizarPaciente(this.pacienteId!, payload)
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Paciente atualizado com sucesso!',
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
            }
    
          Swal.fire({
            icon: 'error',
            title: 'Erro no Cadastro',
            text: mensagemErro
          });
        }
      });
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
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

  get f() {
    return this.pacienteForm.controls as any;
  }
}
