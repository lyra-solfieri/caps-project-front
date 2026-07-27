import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgendamentoRequestDto } from './agendamento-request.dto';
import { AgendamentoResponseDto } from './agendamento-response.dto';


@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private readonly apiUrl = 'http://localhost:8080/api/agendamentos';

  constructor(private http: HttpClient) {}


  cadastrarAgendamento(agendamento: AgendamentoRequestDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, agendamento);
  }


  listarAgendamentos(): Observable<AgendamentoResponseDto[]> {
    return this.http.get<AgendamentoResponseDto[]>(this.apiUrl);
  }

  listarAgendamentPorId(id: number): Observable<AgendamentoResponseDto> {
    return this.http.get<AgendamentoResponseDto>(`${this.apiUrl}/${id}`);
  }


  deletarAgendamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  alertarAgendamento(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/alertar/${id}`);
  }

  atualizarAgendamento(id: number, agendamento: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, agendamento);
  }
}
