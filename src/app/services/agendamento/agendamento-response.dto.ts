/**
 * @file agendamento-response.dto.ts
 * @description Interface de agendamento
 * @version 1.0.0
 * @author Bruno Lyra
 * @copyright Bruno Lyra
 */

export interface AgendamentoResponseDto {
  id: number;
  destinatario: string;
  message: string;
  tipoComunicacao: 'EMAIL' | 'SMS' | 'WHATSAPP';
  dataHoraAtendimento: string;
  dataHoraEnvio: string;
  statusAgendamento: string;
  createAt: string;
  paciente: PacienteDto;
  user: UserDto;
}

export interface PacienteDto {
  id: number;
  nome: string;
  cpf?: string;
}

export interface UserDto {
  id: number;
  nome: string;
  email?: string;
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


