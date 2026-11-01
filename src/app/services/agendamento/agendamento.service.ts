import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgendamentoRequestDto } from './agendamento-request.dto';
import { AgendamentoResponseDto, PageResponse} from './agendamento-response.dto';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private readonly apiUrl = `${environment.apiUrl}/api/agendamentos`;

  constructor(private http: HttpClient) {}


  cadastrarAgendamento(agendamento: AgendamentoRequestDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, agendamento);
  }


  listarAgendamentos(pageNo: number,
      pageSize: number,
      sortBy: string,
      direction: string
      ): Observable<PageResponse<AgendamentoResponseDto> | AgendamentoResponseDto[]> {
        const params = new HttpParams()
        .set('pageNo', pageNo)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('direction', direction);
      return this.http.get<PageResponse<AgendamentoResponseDto> | AgendamentoResponseDto[]>(this.apiUrl, { params });
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
