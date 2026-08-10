export interface RaasOcrUploadResponse {
  correlationId: string;
  processamentoId: number;
  status: 'EM_PROCESSAMENTO' | 'CONCLUIDO' | 'REVISAO_MANUAL' | 'FALHA';
  mensagem: string;
}

export interface OcrProcessamentoStatus {
  id: number;
  correlationId: string;
  originalFileName: string;
  pacienteId: number;
  pacienteCriadoId: number;
  atendimentoCriadoId: number;
  raasCriadoId: number;
  status: 'EM_PROCESSAMENTO' | 'CONCLUIDO' | 'REVISAO_MANUAL' | 'FALHA';
  confidenceGeral: number;
  dadosExtraidosJson: string;
  resultadoJson: string;
  dataCriacao: string;
  dataConclusao: string;
}

export interface OcrAcaoExtraida {
  codigo_acao?: string;
  quantidade?: string | number;
  data_acao?: string;
  cid10?: string;
  servico?: string;
  classificacao?: string;
  cbo_executante?: string;
  cns_profissional?: string;
  codigo_equipe?: string;
  [key: string]: any;
}

export interface OcrDadosExtraidos {
  numero_prontuario?: string;
  nome_paciente?: string;
  cartao_sus?: string;
  sexo?: string;
  data_nascimento?: string;
  nacionalidade?: string;
  raca_cor?: string;
  etnia_indigena?: string;
  nome_mae?: string;
  nome_responsavel?: string;
  municipio_residencia?: string;
  uf?: string;
  codigo_ibge?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  telefone_celular?: string;
  telefone_contato?: string;
  data_admissao?: string;
  mes_atendimento?: string;
  origem_paciente?: string;
  cid_principal?: string;
  descricao_diagnostico_principal?: string;
  cid_causas_associadas?: string;
  descricao_causas_associadas?: string;
  cnes?: string;
  cobertura_esf?: string;
  destino_paciente?: string;
  data_conclusao?: string;
  acoes?: OcrAcaoExtraida[];
  [key: string]: any;
}

export interface OcrResultMessage {
  correlationId: string;
  status: string;
  confidenceGeral: number;
  dadosExtraidos: OcrDadosExtraidos;
  confidences: Record<string, number>;
  camposNaoReconhecidos: string[];
  camposBaixaConfianca: string[];
  erros: string[];
}
