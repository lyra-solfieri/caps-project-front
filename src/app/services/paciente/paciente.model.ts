export interface PacienteDto {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  genero?: string;
  nomeMae: string;
  nomePai: string;
  profissao: string;
  numeroCartaoSUS: string;
  raca?: string;
  numeroProntuario?: number;
  infantojuvenil?: boolean;
  emSituacaoSocioeconomica?: boolean;
  endereco?: EnderecoDto;
}

export interface EnderecoDto {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  rua?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}