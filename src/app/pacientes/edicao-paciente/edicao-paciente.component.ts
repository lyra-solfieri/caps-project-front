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
import { PacienteDto } from '../../services/paciente/paciente.model';
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
  pacienteId!: number;
  private pacienteOriginal: Record<string, any> = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private cepService: ViaCepService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.pacienteId = Number(idParam);
      this.carregarPaciente(this.pacienteId);
    }
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
        this.pacienteOriginal = paciente;
        
        console.log("🕵️ Dados do Paciente recebidos da API:", paciente);

        // 1. Trata a data de nascimento
        let dataFormatada = '';
        if (paciente.dataNascimento) {
          dataFormatada = paciente.dataNascimento.substring(0, 10);
        }

        // 2. A MÁGICA AQUI: Usamos os 3 pontinhos (...paciente) para espalhar
        // todas as propriedades e sobrescrevemos a dataNascimento com a formatada
        this.pacienteForm.patchValue({
          ...paciente, 
          dataNascimento: dataFormatada
        });

        // 3. Força a atualização do endereço (objeto aninhado)
        if (paciente.endereco) {
          this.pacienteForm.get('endereco')?.patchValue(paciente.endereco);
        }

        console.log("📝 Valores do Form após Patch:", this.pacienteForm.value);
      },
      error: () => {
        Swal.fire('Erro', 'Paciente não encontrado', 'error');
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

    // A API pode devolver propriedades que ainda não possuem campo nesta tela.
    // Em um PUT, enviá-las novamente impede que sejam apagadas ao salvar uma edição.
    const { id: _id, endereco: enderecoOriginal, ...dadosOriginais } = this.pacienteOriginal;
    const { endereco, ...dadosFormulario } = this.pacienteForm.getRawValue();
    const pacienteAtualizado: PacienteDto = {
      ...dadosOriginais,
      ...dadosFormulario,
      endereco: {
        ...(enderecoOriginal ?? {}),
        ...endereco
      }
    };

    this.pacienteService.atualizarPaciente(this.pacienteId, pacienteAtualizado)
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
        error: (err: HttpErrorResponse) => {
          let mensagemErro = 'Erro ao atualizar paciente.';
          if (err.error && err.error.mensagem) {
             mensagemErro = err.error.mensagem;
          }
          Swal.fire({
            icon: 'error',
            title: 'Erro',
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
