export interface RaasAcaoDTO {
  codigoAcao: string;
  quantidade: number | null;
  data: string;
  servico: string;
  classificacao: string;
  cboExecutor: string;
  cartaoProfissional: string;
  codigoEquipe: string;
  cid10: string;
  caps: boolean;
  territorio: boolean;
}

export interface RaasRequestDTO {
  pacienteId: number;
  atendimentoId?: number | null;
  nomeEstabelecimento: string;
  cnes: string;
  acoes: RaasAcaoDTO[];

  dataAdmissao?: string | null;
  dataConclusao?: string | null;
  mesAtendimento?: string;
  numeroAutorizacao?: number | null;

  usoDrogas?: string;
  alcool?: boolean;
  crack?: boolean;
  outrasDrogas?: boolean;

  origemDemanda?: boolean;
  origemAtencaoBasica?: boolean;
  origemUrgencia?: boolean;
  origemCaps?: boolean;
  origemHospital?: boolean;
  origemPsiquiatrico?: boolean;

  cidPrincipal?: string;
  descricaoCidPrincipal?: string;
  cidSecundario?: string;
  descricaoCidSecundario?: string;

  esf?: string;
  cnesAtendimento?: string;

  encaminhamentoCaps?: boolean;
  encaminhamentoAB?: boolean;
  alta?: boolean;
  obito?: boolean;
}

export interface RaasAceitarDTO {
  correlationId: string;

  nomeEstabelecimento: string;
  cnes: string;

  numeroProntuario: string;
  nomePaciente: string;
  cartaoSus: string;
  sexo: string;
  dataNascimento: string;
  nomeMae: string;
  nacionalidade: string;
  racaCor: string;
  etniaIndigena: string;
  nomeResponsavel: string;
  municipio: string;
  uf: string;
  codigoIbge: string;
  cep: string;
  endereco: string;
  complemento: string;
  telefoneCelular: string;
  telefoneContato: string;

  dataAdmissao: string;
  dataConclusao: string;
  mesAtendimento: string;
  numeroAutorizacao: number | null;

  usoDrogas: string;
  alcool: boolean;
  crack: boolean;
  outrasDrogas: boolean;

  origemDemanda: boolean;
  origemAtencaoBasica: boolean;
  origemUrgencia: boolean;
  origemCaps: boolean;
  origemHospital: boolean;
  origemPsiquiatrico: boolean;

  cidPrincipal: string;
  descricaoCidPrincipal: string;
  cidSecundario: string;
  descricaoCidSecundario: string;

  esf: string;
  cnesAtendimento: string;

  encaminhamentoCaps: boolean;
  encaminhamentoAB: boolean;
  alta: boolean;
  obito: boolean;

  acoes: RaasAcaoDTO[];
}

export interface RaasResponseDTO {
  id: number;

  nomeEstabelecimento: string;
  cnes: string;

  nomePaciente: string;
  cartaoSus: string;
  sexo: string;
  dataNascimento: string;
  nomeMae: string;

  dataAdmissao: string;
  dataConclusao: string;
  mesAtendimento: string;
  numeroAutorizacao: number | null;

  status: boolean;
  enviadoSUS: boolean;
  dataGeracao: string;

  pacienteId?: number;
  atendimentoId?: number;
  acoes: RaasAcaoDTO[];
}

export interface RaasPageResponse {
  content: RaasResponseDTO[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
