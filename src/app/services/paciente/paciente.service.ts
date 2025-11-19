import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private readonly apiUrl = 'http://localhost:8080/api/pacientes';

  
  constructor(private http: HttpClient) {}


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  
  criarPaciente(paciente: PacienteDto): Observable<any> {
    return this.http.post(this.apiUrl, paciente, {headers: this.getHeaders() });    
  }

  listarPacientes(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  excluirPaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizarPaciente(id: number, paciente: PacienteDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente, { headers: this.getHeaders()})
  }

  buscarPacientePorId(id: number): Observable<any> {
   return this.http.get<PacienteDto>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
