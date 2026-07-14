export interface EvolucaoDTO {
  id?: number;
  pacienteId?: number;
  pacienteNome?: string;
  codProntuario?: number;
  dataHoraEdicao?: string;
  nomeProfissional?: string;
  texto: string;
}