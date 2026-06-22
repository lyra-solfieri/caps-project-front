import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente/paciente.service';
import { PacienteDto } from '../../services/paciente/paciente.model';
import { RaasService } from '../../services/raas/raas.service';
import { RaasRequestDTO } from '../../services/raas/raas.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-raas',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
templateUrl: './raas.component.html',
styleUrls: ['./raas.component.css']
})
export class RaasComponent implements OnInit {

  raasForm!: FormGroup;
  paciente!: PacienteDto;
  raasId!: number;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private raasService: RaasService,
    private route: ActivatedRoute,
    private router: Router
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
    nomeMae: [''],
    nacionalidade: [''],
    racaCor: [''],
    etniaIndigena: [''],
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

    const pacienteId = this.route.snapshot.paramMap.get('id')
      ?? this.route.snapshot.queryParamMap.get('pacienteId');

    if (pacienteId) {
      this.buscarPaciente(+pacienteId);
    }

    this.adicionarAcao();
  }


  get acoes(): FormArray {
    return this.raasForm.get('acoesRealizadas') as FormArray;
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
      caps: [false],
      territorio: [false]
    });
  }

  adicionarAcao() {
    this.acoes.push(this.novaAcao());
  }

  removerAcao(index: number) {
    if (this.acoes.length > 1) {
      this.acoes.removeAt(index);
    }
  }

  buscarPaciente(pacienteId: number) {
    this.pacienteService.buscarPacientePorId(pacienteId).subscribe({
      next: (paciente: PacienteDto) => {

        this.paciente = paciente;

        this.raasForm.patchValue({
          numeroProntuario: paciente.numeroProntuario,
          nomePaciente: paciente.nome,
          cartaoSus: paciente.numeroCartaoSUS,
          sexo: paciente.genero,
          dataNascimento: paciente.dataNascimento,
          nomeMae: paciente.nomeMae,

          telefoneCelular: paciente.telefone,
          endereco: paciente.endereco?.logradouro,
          municipio: paciente.endereco?.cidade,
          uf: paciente.endereco?.estado
        });
      },
      error: (err) => {
        console.error('Erro ao buscar paciente', err);
      }
    });
  }


  salvarRaas() {
    if (this.salvando || !this.paciente?.id) return;

    this.salvando = true;
    const dto: RaasRequestDTO = {
      pacienteId: this.paciente.id!,
      atendimentoId: 1,
      nomeEstabelecimento: this.raasForm.value.nomeEstabelecimento,
      cnes: this.raasForm.value.cnes,
      acoes: this.raasForm.value.acoesRealizadas
    };

    this.raasService.criar(dto).subscribe({
      next: (res) => {
        this.raasId = res.id;
        this.salvando = false;
      },
      error: () => {
        this.salvando = false;
      }
    });
  }

  exportarPDF() {
    if (!this.raasId) {
      alert('Salve o RAAS antes de gerar o PDF');
      return;
    }

    this.raasService.gerarPdf(this.raasId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err) => {
        console.error('Erro ao gerar PDF', err);
      }
    });
  }

  voltar() {
    this.router.navigate(['/raas']);
  }

}