import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from '../app-header/app-header.component'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../services/paciente/paciente.service';
import { PacienteDto } from '../services/paciente/paciente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-raas',
  imports: [
    AppHeaderComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './raas.component.html',
  styleUrl: './raas.component.css'
})
export class RaasComponent implements OnInit {
  acoesRealizadas!: FormArray;
  raasForm!: FormGroup;
  paciente!: PacienteDto;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {

    this.raasForm = this.fb.group({

      nomeEstabelecimento: [''],
      cnes: [''],
      numeroProntuario: [''],
      nomePaciente: [''],
      cartaoSus: [''],
      sexo: [''],
      dataNascimento: [''],
      nacionalidade: [''],

      racaCor: [''],
      etniaIndigena: [''],
      nomeMae: [''],

      nomeResponsavel: [''],
      municipio: [''],
      uf: [''],

      codigoIbge: [''],
      cep: [''],
      endereco: [''],
      complemento: [''],

      telefoneCelular: [''],
      telefoneContato: [''],

      dataAdmissao: [''],
      mesAtendimento: [''],
      numeroAutorizacao: [''],

      usoDrogas: [''],
      alcool: [false],
      crack: [false],
      outrasDrogas: [false],

      origemDemanda: [false],
      origemAtencaoBasica: [false],
      origemUrgencia: [false],
      origemCaps: [false],
      origemHospital: [false],
      origemPsiquiatrico: [false],

      cidPrincipal: [''],
      descricaoCidPrincipal: [''],

      cidSecundario: [''],
      descricaoCidSecundario: [''],
      esf: [''],
      cnesAtendimento: [''],
      encaminhamentoCaps: [false],
      encaminhamentoAB: [false],
      alta: [false],
      obito: [false],
      dataConclusao: [''],
      acoesRealizadas: this.fb.array([])
    });

    this.adicionarAcao();
    
  }

  get acoes(): FormArray {
    return this.raasForm.get('acoesRealizadas') as FormArray
  }

  novaAcao(): FormGroup {
    return this.fb.group({
      codigoAcao: [''],
      quantidade: [''],
      data: [''],
      servico: [''],
      classificacao: [''],
      cboExecutor: [''],
      cartaoProfissional: [''],
      acaoCaps: [false],
      acaoTerritorio: [false]
    });
  }

  adicionarAcao() {
    this.acoes.push(this.novaAcao());
  }

  removerAcao(index: number) {
    if (this.acoes.length === 1) {
      return;
    }
    this.acoes.removeAt(index);
  }

  buscarPaciente(pacienteId: number) {
    this.pacienteService.buscarPacientePorId(pacienteId).subscribe({
      next: (paciente: PacienteDto) => {
        console.log("🚀 ~ RaasComponent ~ buscarPaciente ~ paciente:", paciente);
        
        this.raasForm.patchValue({
          nomeEstabelecimento: paciente.nome,
          // cnes: paciente.cnes,
          numeroProntuario: paciente.numeroProntuario,
          nomePaciente: paciente.nome,
          numeroCartaoSUS: paciente.numeroCartaoSUS,
          sexo: paciente.genero,
          dataNascimento: paciente.dataNascimento,
          // nacionalidade: paciente.nacionalidade,
          raca: paciente.raca,
          nomeMae: paciente.nomeMae
        });
      }
    })
    
  }

  exportarPDF() {
    
  }

}
