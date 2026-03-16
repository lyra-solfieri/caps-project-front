import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnamneseDTO } from './anamnese.model';

@Injectable({
  providedIn: 'root'
})
export class AnamneseService {

  private API = "http://localhost:8080/anamneses";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  criarAnamnese(data: AnamneseDTO): Observable<any> {
    return this.http.post(this.API, data, { headers: this.getHeaders() });
  }

  listarAnamneses(): Observable<any> {
    return this.http.get(this.API, { headers: this.getHeaders() });
  }

  excluirAnamnese(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, { headers: this.getHeaders() });
  }

  editarAnamnese(id: number, data: AnamneseDTO): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data, { headers: this.getHeaders() });
  }

}