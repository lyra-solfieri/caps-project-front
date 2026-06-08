import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  cadastrarAgendamento(agendamento: AgendamentoRequestDto): Observable<string> {
    return this.http.post<string>(
      this.apiUrl,
      agendamento,
      { headers: this.getHeaders() }
    );
  }


  listarAgendamentos(): Observable<AgendamentoResponseDto[]> {
    return this.http.get<AgendamentoResponseDto[]>(
      this.apiUrl,
      { headers: this.getHeaders() }
    );
  }

  listarAgendamentPorId(id: number): Observable<AgendamentoResponseDto> {
    return this.http.get<AgendamentoResponseDto>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }


  deletarAgendamento(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }


  alertarAgendamento(id: number): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/alertar/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
