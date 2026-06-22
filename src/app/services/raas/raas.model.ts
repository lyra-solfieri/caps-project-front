export interface RaasAcaoDTO {
  codigoAcao: string;
  quantidade: number;
  data: string;
  servico: string;
  classificacao: string;
  cboExecutor: string;
  cartaoProfissional: string;
  caps: boolean;
  territorio: boolean;
} 

export interface RaasRequestDTO {
  pacienteId: number;
  atendimentoId: number;

  nomeEstabelecimento: string;
  cnes: string;

  acoes: RaasAcaoDTO[];
}

export interface RaasResponseDTO extends RaasRequestDTO {
  id: number;

  nomePaciente: string;
  cartaoSus: number;
  dataNascimento: string;
  nomeMae: string;

  dataAdmissao: string;
  dataConclusao: string;
  mesAtendimento: string;
  numeroAutorizacao: number;
}