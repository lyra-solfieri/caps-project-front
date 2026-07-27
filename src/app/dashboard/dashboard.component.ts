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
import { downloadCSV } from '../relatorios/utils/csv-export.util';
import { downloadExcel } from '../relatorios/utils/excel-export.util';
import { downloadPDF } from '../relatorios/utils/pdf-export.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective, ModalExportarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isAdmin = false;
  hasClinicalAccess = false;
  mostrarModalExportar = false;

  // KPIs Mockados
  stats = {
    taxaComparecimento: '84%',
    totalConsultasMes: 1240,
    cancelamentosMes: 42,
    satisfacaoMedia: 4.8
  };

  // Configuração do Gráfico de Barras (Comparecimento Semanal)
  public barChartData: ChartData<'bar'> = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    datasets: [
      { data: [45, 52, 48, 60, 38], label: 'Presentes', backgroundColor: '#00796b' },
      { data: [10, 5, 8, 2, 12], label: 'Faltas', backgroundColor: '#ff8a65' }
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
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.hasClinicalAccess = this.authService.hasAnyRole(['ADMIN', 'MODERATOR', 'EDITOR']);
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
        this.agendamentoService.listarAgendamentos().subscribe({
          next: (d) => {
            if (event.formato === 'csv') downloadCSV(d, event.relatorio);
            else if (event.formato === 'excel') downloadExcel(d, event.relatorio);
            else downloadPDF(d, event.relatorio);
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