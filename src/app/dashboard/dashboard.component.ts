import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isAdmin = false;

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }
}