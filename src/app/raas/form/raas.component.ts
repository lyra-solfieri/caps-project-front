import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente/paciente.service';
import { PacienteDto } from '../../services/paciente/paciente.model';
import { RaasService } from '../../services/raas/raas.service';
import { RaasAceitarDTO, RaasAcaoDTO, RaasRequestDTO } from '../../services/raas/raas.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OcrService } from '../../services/raas/ocr.service';
import { OcrAcaoExtraida, OcrResultMessage } from '../../services/raas/ocr.model';
import Swal from 'sweetalert2';

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
  modoEdicao = false;

  origemOcr = false;
  confidenceGeral = 0;
  correlationId: string | null = null;
  camposBaixaConfianca: string[] = [];
  camposNaoReconhecidos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private raasService: RaasService,
    private ocrService: OcrService,
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

    this.correlationId = this.route.snapshot.paramMap.get('correlationId');

    if (this.correlationId) {
      this.carregarDadosOcr(this.correlationId);
    } else {
      const idParam = this.route.snapshot.paramMap.get('id')
        ?? this.route.snapshot.queryParamMap.get('pacienteId');

      if (this.router.url.startsWith('/raas/editar') && idParam) {
        this.modoEdicao = true;
        this.raasId = +idParam;
        this.carregarRaas(this.raasId);
      } else if (idParam) {
        this.buscarPaciente(+idParam);
      }
    }

    this.adicionarAcao();
  }

  private carregarRaas(id: number): void {
    this.raasService.buscarPorId(id).subscribe({
      next: (raas) => {

        this.raasForm.patchValue({
          nomeEstabelecimento: raas.nomeEstabelecimento,
          cnes: raas.cnes,

          nomePaciente: raas.nomePaciente,
          cartaoSus: raas.cartaoSus,
          sexo: raas.sexo === 'MASCULINO' ? 'M' : raas.sexo === 'FEMININO' ? 'F' : '',
          dataNascimento: raas.dataNascimento || '',
          nomeMae: raas.nomeMae,

          dataAdmissao: raas.dataAdmissao || '',
          dataConclusao: raas.dataConclusao || '',
          mesAtendimento: raas.mesAtendimento || '',
          numeroAutorizacao: raas.numeroAutorizacao ?? ''
        });

        if (Array.isArray(raas.acoes)) {
          this.acoes.clear();
          for (const a of raas.acoes) {
            this.acoes.push(this.fb.group({
              codigoAcao: a.codigoAcao || '',
              quantidade: a.quantidade ?? '',
              data: a.data || '',
              servico: a.servico || '',
              classificacao: a.classificacao || '',
              cboExecutor: a.cboExecutor || '',
              cartaoProfissional: a.cartaoProfissional || '',
              codigoEquipe: a.codigoEquipe || '',
              cid10: a.cid10 || '',
              caps: !!a.caps,
              territorio: !!a.territorio
            }));
          }
        }

        if (raas.pacienteId) {
          this.buscarPaciente(raas.pacienteId);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar RAAS', err);
        Swal.fire('Erro', 'Não foi possível carregar o RAAS informado.', 'error');
      }
    });
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
      codigoEquipe: [''],
      cid10: [''],
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


  carregarDadosOcr(correlationId: string) {
    this.ocrService.resultado(correlationId).subscribe({
      next: (result: OcrResultMessage) => {
        this.origemOcr = true;
        this.confidenceGeral = result.confidenceGeral || 0;
        this.camposBaixaConfianca = result.camposBaixaConfianca || [];
        this.camposNaoReconhecidos = result.camposNaoReconhecidos || [];
        const d = result.dadosExtraidos || {};

        this.raasForm.patchValue({
          cnes: d.cnes || '',
          nomeEstabelecimento: '',

          numeroProntuario: d.numero_prontuario || '',
          nomePaciente: d.nome_paciente || '',
          cartaoSus: d.cartao_sus || '',
          sexo: this.mapearSexo(d.sexo),
          dataNascimento: this.converterData(d.data_nascimento),
          nomeMae: d.nome_mae || '',
          nacionalidade: d.nacionalidade || '',
          racaCor: this.mapearRacaParaSelect(d.raca_cor),
          etniaIndigena: d.etnia_indigena || '',
          nomeResponsavel: d.nome_responsavel || '',
          municipio: d.municipio_residencia || '',
          uf: d.uf || '',
          codigoIbge: d.codigo_ibge || '',
          cep: d.cep || '',
          endereco: d.logradouro || '',
          complemento: d.complemento || '',
          telefoneCelular: d.telefone_celular || '',
          telefoneContato: d.telefone_contato || '',

          dataAdmissao: this.converterData(d.data_admissao),
          mesAtendimento: d.mes_atendimento || '',
          dataConclusao: this.converterData(d.data_conclusao),

          cidPrincipal: d.cid_principal || '',
          descricaoCidPrincipal: d.descricao_diagnostico_principal || '',
          cidSecundario: d.cid_causas_associadas || '',
          descricaoCidSecundario: d.descricao_causas_associadas || '',

          esf: this.mapearEsf(d.cobertura_esf),
          cnesAtendimento: d.cnes || ''
        });

        this.aplicarOrigem(d.origem_paciente);
        this.aplicarDestino(d.destino_paciente);

        this.carregarAcoes(d.acoes, this.raasForm.value.dataAdmissao);
      },
      error: () => {
        console.error('Erro ao carregar dados do OCR');
      }
    });
  }

  private carregarAcoes(acoes: OcrAcaoExtraida[] | undefined, dataAdmissao?: string): void {
    if (!Array.isArray(acoes) || acoes.length === 0) {
      return;
    }
    const anoReferencia = dataAdmissao ? Number(String(dataAdmissao).slice(0, 4)) : new Date().getFullYear();

    this.acoes.clear();
    for (const a of acoes) {
      this.acoes.push(this.fb.group({
        codigoAcao: a.codigo_acao || '',
        quantidade: a.quantidade ?? '',
        data: this.converterDataAcao(a.data_acao, anoReferencia),
        servico: a.servico || '',
        classificacao: a.classificacao || '',
        cboExecutor: a.cbo_executante || '',
        cartaoProfissional: a.cns_profissional || '',
        codigoEquipe: a.codigo_equipe || '',
        cid10: a.cid10 || '',
        caps: false,
        territorio: false
      }));
    }
  }

  private aplicarOrigem(origem?: string): void {
    if (!origem) return;
    const o = origem.toLowerCase();
    if (o.includes('urg')) {
      this.raasForm.patchValue({ origemUrgencia: true });
    } else if (o.includes('atenc') || o.includes('básica') || o.includes('basica')) {
      this.raasForm.patchValue({ origemAtencaoBasica: true });
    } else if (o.includes('intern')) {
      this.raasForm.patchValue({ origemHospital: true });
    } else if (o.includes('psiqu')) {
      this.raasForm.patchValue({ origemPsiquiatrico: true });
    } else if (o.includes('caps')) {
      this.raasForm.patchValue({ origemCaps: true });
    } else if (o.includes('demanda') || o.includes('outros')) {
      this.raasForm.patchValue({ origemDemanda: true });
    }
  }

  private aplicarDestino(destino?: string): void {
    if (!destino) return;
    const d = destino.toLowerCase();
    if (d.includes('alta')) {
      this.raasForm.patchValue({ alta: true });
    }
    if (d.includes('óbito') || d.includes('obito')) {
      this.raasForm.patchValue({ obito: true });
    }
    if (d.includes('encaminh')) {
      this.raasForm.patchValue({ encaminhamentoAB: true });
    }
  }

  private mapearSexo(sexo?: string): string {
    if (!sexo) return '';
    const s = sexo.toUpperCase().trim();
    if (s === 'MASCULINO' || s === 'M') return 'M';
    if (s === 'FEMININO' || s === 'F') return 'F';
    return '';
  }

  private mapearRacaParaSelect(raca?: string): string {
    if (!raca) return '';
    const r = raca.toUpperCase().trim();
    if (r.includes('BRANC')) return '01';
    if (r.includes('PRET')) return '02';
    if (r.includes('PARD')) return '03';
    if (r.includes('AMAREL')) return '04';
    if (r.includes('INDIG')) return '05';
    return '';
  }

  private mapearRacaParaDto(select: string): string {
    switch (select) {
      case '01': return 'BRANCA';
      case '02': return 'PRETA';
      case '03': return 'PARDA';
      case '04': return 'AMARELA';
      case '05': return 'INDIGENA';
      default: return select || '';
    }
  }

  private mapearEsf(esf?: string): string {
    if (!esf) return '';
    const e = esf.toUpperCase().trim();
    if (e.startsWith('S')) return 'SIM';
    if (e.startsWith('N')) return 'NAO';
    return '';
  }

  private converterData(data?: string): string {
    if (!data) return '';
    const match = data.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }
    return data;
  }

  private converterDataAcao(data?: string, anoReferencia?: number): string {
    if (!data) return '';
    const iso = data.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
      return data;
    }
    const ddmm = data.match(/(\d{2})[\/\-](\d{2})/);
    if (ddmm) {
      const year = anoReferencia || new Date().getFullYear();
      return `${year}-${ddmm[2]}-${ddmm[1]}`;
    }
    return data;
  }

  salvarRaas() {
    if (this.salvando) return;

    if (this.correlationId) {
      this.aceitarRaas();
      return;
    }

    if (!this.paciente?.id) {
      Swal.fire('Atenção', 'Selecione um paciente antes de salvar o RAAS.', 'warning');
      return;
    }

    this.salvando = true;
    const v = this.raasForm.value;
    const dto: RaasRequestDTO = {
      pacienteId: this.paciente.id!,
      nomeEstabelecimento: v.nomeEstabelecimento,
      cnes: v.cnes,
      acoes: this.montarAcoes(),

      dataAdmissao: v.dataAdmissao || null,
      dataConclusao: v.dataConclusao || null,
      mesAtendimento: v.mesAtendimento,
      numeroAutorizacao: v.numeroAutorizacao ? Number(v.numeroAutorizacao) : null,

      usoDrogas: v.usoDrogas,
      alcool: !!v.alcool,
      crack: !!v.crack,
      outrasDrogas: !!v.outrasDrogas,

      origemDemanda: !!v.origemDemanda,
      origemAtencaoBasica: !!v.origemAtencaoBasica,
      origemUrgencia: !!v.origemUrgencia,
      origemCaps: !!v.origemCaps,
      origemHospital: !!v.origemHospital,
      origemPsiquiatrico: !!v.origemPsiquiatrico,

      cidPrincipal: v.cidPrincipal,
      descricaoCidPrincipal: v.descricaoCidPrincipal,
      cidSecundario: v.cidSecundario,
      descricaoCidSecundario: v.descricaoCidSecundario,

      esf: v.esf,
      cnesAtendimento: v.cnesAtendimento,

      encaminhamentoCaps: !!v.encaminhamentoCaps,
      encaminhamentoAB: !!v.encaminhamentoAB,
      alta: !!v.alta,
      obito: !!v.obito
    };

    const request$ = this.modoEdicao && this.raasId
      ? this.raasService.atualizar(this.raasId, dto)
      : this.raasService.criar(dto);

    request$.subscribe({
      next: (res) => {
        this.salvando = false;
        this.raasId = res.id;
        Swal.fire({
          title: this.modoEdicao ? 'RAAS atualizado com sucesso!' : 'RAAS salvo com sucesso!',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          if (this.modoEdicao) {
            this.router.navigate(['/raas']);
          }
        });
      },
      error: (err) => {
        this.salvando = false;
        const msg = typeof err?.error === 'object' && err?.error?.message
          ? err.error.message
          : (typeof err?.error === 'string' && err.error ? err.error : null);
        Swal.fire('Erro', msg ?? 'Falha ao salvar o RAAS.', 'error');
      }
    });
  }

  private aceitarRaas() {
    this.salvando = true;
    const v = this.raasForm.value;
    const dto: RaasAceitarDTO = {
      correlationId: this.correlationId!,

      nomeEstabelecimento: v.nomeEstabelecimento,
      cnes: v.cnes,

      numeroProntuario: v.numeroProntuario,
      nomePaciente: v.nomePaciente,
      cartaoSus: v.cartaoSus,
      sexo: v.sexo,
      dataNascimento: v.dataNascimento || null,
      nomeMae: v.nomeMae,
      nacionalidade: v.nacionalidade,
      racaCor: this.mapearRacaParaDto(v.racaCor),
      etniaIndigena: v.etniaIndigena,
      nomeResponsavel: v.nomeResponsavel,
      municipio: v.municipio,
      uf: v.uf,
      codigoIbge: v.codigoIbge,
      cep: v.cep,
      endereco: v.endereco,
      complemento: v.complemento,
      telefoneCelular: v.telefoneCelular,
      telefoneContato: v.telefoneContato,

      dataAdmissao: v.dataAdmissao || null,
      dataConclusao: v.dataConclusao || null,
      mesAtendimento: v.mesAtendimento,
      numeroAutorizacao: v.numeroAutorizacao ? Number(v.numeroAutorizacao) : null,

      usoDrogas: v.usoDrogas,
      alcool: !!v.alcool,
      crack: !!v.crack,
      outrasDrogas: !!v.outrasDrogas,

      origemDemanda: !!v.origemDemanda,
      origemAtencaoBasica: !!v.origemAtencaoBasica,
      origemUrgencia: !!v.origemUrgencia,
      origemCaps: !!v.origemCaps,
      origemHospital: !!v.origemHospital,
      origemPsiquiatrico: !!v.origemPsiquiatrico,

      cidPrincipal: v.cidPrincipal,
      descricaoCidPrincipal: v.descricaoCidPrincipal,
      cidSecundario: v.cidSecundario,
      descricaoCidSecundario: v.descricaoCidSecundario,

      esf: v.esf,
      cnesAtendimento: v.cnesAtendimento,

      encaminhamentoCaps: !!v.encaminhamentoCaps,
      encaminhamentoAB: !!v.encaminhamentoAB,
      alta: !!v.alta,
      obito: !!v.obito,

      acoes: this.montarAcoes()
    };

    this.ocrService.aceitar(dto).subscribe({
      next: (res) => {
        this.salvando = false;
        this.raasId = res.id;
        Swal.fire({
          title: 'RAAS aceito!',
          text: `RAAS #${res.id} criado e salvo com sucesso.`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => this.router.navigate(['/raas']));
      },
      error: (err) => {
        this.salvando = false;
        const msg = err?.error || 'Falha ao aceitar o RAAS.';
        Swal.fire('Erro', String(msg), 'error');
      }
    });
  }

  private montarAcoes(): RaasAcaoDTO[] {
    return this.raasForm.value.acoesRealizadas
      .map((a: any) => ({
        codigoAcao: a.codigoAcao || '',
        quantidade: a.quantidade !== '' && a.quantidade != null ? Number(a.quantidade) : null,
        data: a.data || null,
        servico: a.servico || '',
        classificacao: a.classificacao || '',
        cboExecutor: a.cboExecutor || '',
        cartaoProfissional: a.cartaoProfissional || '',
        codigoEquipe: a.codigoEquipe || '',
        cid10: a.cid10 || '',
        caps: !!a.caps,
        territorio: !!a.territorio
      }))
      .filter((a: RaasAcaoDTO) =>
        a.codigoAcao || a.quantidade != null || a.data || a.servico || a.cid10);
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
