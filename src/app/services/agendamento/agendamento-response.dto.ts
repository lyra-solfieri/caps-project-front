/**
 * @file agendamento-response.dto.ts
 * @description Interface de agendamento
 * @version 1.0.0
 * @author Bruno Lyra
 * @copyright Bruno Lyra
 */

export interface AgendamentoResponseDto {
  destinatario: string;
  message: string;
  tipoComunicacao: 'EMAIL' | 'SMS' | 'WHATSAPP';
  dataHoraEnvio: string;
  statusAgendamento: string;
  createAt: string;
  paciente: PacienteDto;
  user: UserDto;
}

export interface PacienteDto {
  id: number;
  nome: string;
}

export interface UserDto {
  id: number;
  nome: string;
}


