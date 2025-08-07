import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AgendamentoService {
    private readonly apiUrl = 'http://localhost:8080/api/agendamentos';

    constructor(private http: HttpClient) {}
    private token = localStorage.getItem('token');


    listarAgendamentos(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        return this.http.get(this.apiUrl, { headers });
    }

    cadastrarAgendamento(agendamento: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        return this.http.post(this.apiUrl, agendamento, { headers });
    }

}