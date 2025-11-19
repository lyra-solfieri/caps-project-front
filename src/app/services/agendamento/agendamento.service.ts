import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AgendamentoService {
    private readonly apiUrl = 'http://localhost:8080/api/agendamentos';

    constructor(private http: HttpClient) {}
    private token = localStorage.getItem('auth_token');

    getHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    listarAgendamentos(): Observable<any> {
        return this.http.get(this.apiUrl, { headers: this.getHeaders() });
    }

    cadastrarAgendamento(agendamento: any): Observable<any> {
        return this.http.post(this.apiUrl, agendamento, { headers: this.getHeaders() });
    }

}