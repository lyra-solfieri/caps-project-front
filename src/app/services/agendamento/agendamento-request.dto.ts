/**
 * @file agendamento-request.dto.ts
 * @description Interface de agendamento
 * @version 1.0.0
 * @author Bruno Lyra
 * @copyright Bruno Lyra
 * 
 */

export interface AgendamentoRequestDto {
  pacienteId: number;
  destinatario: string;
  message: string;
  tipoComunicacao: 'EMAIL' | 'SMS' | 'WHATSAPP';
  dataHoraEnvio: string;
}
