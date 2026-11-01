import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../services/auth.service';
import { ModalExportarComponent } from '../relatorios/modal-exportar/modal-exportar.component';
import { HttpClient } from '@angular/common/http';
import { PacienteService } from '../services/paciente/paciente.service';
import { AgendamentoService } from '../services/agendamento/agendamento.service';
import { forkJoin } from 'rxjs';
import { RelatoriosService } from '../services/relatorios/relatorios.service';
import { RaasService } from '../services/raas/raas.service';
import { UserService } from '../services/user/user.service';
import { downloadCSV } from '../relatorios/utils/csv-export.util';
import { downloadExcel } from '../relatorios/utils/excel-export.util';
import { downloadPDF } from '../relatorios/utils/pdf-export.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalExportarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isAdmin = false;
  hasClinicalAccess = false;
  mostrarModalExportar = false;
  carregando = true;

  totalPacientes = 0;
  totalRaasGeradas = 0;
  totalRaasExportadas = 0;
  totalUsuariosAtivos = 0;

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Atendimentos', backgroundColor: '#00796b' }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private pacienteService: PacienteService,
    private agendamentoService: AgendamentoService,
    private relatoriosService: RelatoriosService,
    private raasService: RaasService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.hasClinicalAccess = this.authService.hasAnyRole(['ADMIN', 'USER']);
    this.carregarIndicadores();
  }

  private carregarIndicadores(): void {
    this.carregando = true;

    forkJoin({
      indicadores: this.relatoriosService.obterIndicadores(),
      raas: this.raasService.listarPaginado(0, 1),
      atendimentos: this.relatoriosService.obterAtendimentosPorProfissional()
    }).subscribe({
      next: ({ indicadores, raas, atendimentos }) => {
        this.totalPacientes = indicadores.totalPacientes;
        this.totalRaasGeradas = raas.totalElements;
        this.barChartData = {
          labels: atendimentos.map((a) => a.mes),
          datasets: [
            { data: atendimentos.map((a) => a.quantidade), label: 'Atendimentos', backgroundColor: '#00796b' }
          ]
        };
        this.carregando = false;
      },
      error: () => this.carregando = false
    });

    if (this.isAdmin) {
      this.userService.listarUsuarios().subscribe({
        next: (users) => {
          this.totalUsuariosAtivos = users.length;
        }
      });

      this.raasService.listarPaginado(0, 1000).subscribe({
        next: (page) => {
          this.totalRaasExportadas = page.content.filter((r) => r.enviadoSUS).length;
        }
      });
    }
  }

  abrirModalExportar(): void {
    this.mostrarModalExportar = true;
  }

  fecharModalExportar(): void {
    this.mostrarModalExportar = false;
  }

  onExportar(event: { relatorio: string; formato: string }): void {
    this.fecharModalExportar();
    switch (event.relatorio) {
      case 'Pacientes Cadastrados':
        this.pacienteService.listarPacientes(0, 1000, 'id', 'asc').subscribe({
          next: (p) => {
            if (event.formato === 'csv') downloadCSV(p.content, event.relatorio);
            else if (event.formato === 'excel') downloadExcel(p.content, event.relatorio);
            else downloadPDF(p.content, event.relatorio);
          }
        });
        break;
      case 'Agendamentos':
        this.agendamentoService.listarAgendamentos(0, 1000, 'id', 'asc').subscribe({
          next: (d) => {
            const agendamentos = Array.isArray(d) ? d : d.content;
            if (event.formato === 'csv') downloadCSV(agendamentos, event.relatorio);
            else if (event.formato === 'excel') downloadExcel(agendamentos, event.relatorio);
            else downloadPDF(agendamentos, event.relatorio);
          }
        });
        break;
      default:
        if (event.formato === 'pdf') {
          downloadPDF([], event.relatorio);
        }
    }
  }
}
