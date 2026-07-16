import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-grafico-relatorio',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="grafico-wrapper">
      <h3>{{ titulo }}</h3>
      <div class="canvas-wrapper">
        <canvas baseChart [data]="chartData" [options]="chartOptions"></canvas>
      </div>
    </div>
  `,
  styles: [`
    .grafico-wrapper { padding: 16px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .grafico-wrapper h3 { margin: 0 0 16px; color: #1f2937; }
    .canvas-wrapper { height: 300px; }
  `]
})
export class GraficoRelatorioComponent {
  @Input() titulo: string = '';

  private _dados: any = null;

  @Input() set dados(value: any) {
    this._dados = value;
    if (value) this.montarGrafico(value);
  }
  get dados(): any { return this._dados; }

  @Input() tipoGrafico: 'bar' | 'doughnut' | 'line' | 'pie' = 'bar';

  public chartData: ChartData = { labels: [], datasets: [] };
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };
  public chartType: string = 'bar';

  private montarGrafico(value: any): void {
    this.chartType = this.tipoGrafico;
  }
}
