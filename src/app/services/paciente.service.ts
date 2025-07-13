import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PacienteDto {
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
  endereco?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private readonly apiUrl = 'http://localhost:8080/api/pacientes';

  
  constructor(private http: HttpClient) {}
  
criarPaciente(paciente: PacienteDto): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.post(this.apiUrl, paciente, { headers });
}

}
