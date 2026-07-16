import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-exportar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="fechar()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Exportar Dados</h3>
          <button class="btn-close" (click)="fechar()">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">Selecione um relatório e formato para exportação:</p>

          <div class="export-grid">
            <div class="export-card" *ngFor="let item of relatorios" (click)="selecionar(item)">
              <div class="card-icon" [style.color]="item.cor">
                <i [class]="item.icone"></i>
              </div>
              <span>{{ item.titulo }}</span>
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>

          <div class="format-select" *ngIf="selecionado">
            <p>Formato para <strong>{{ selecionado.titulo }}</strong>:</p>
            <div class="format-options">
              <button class="btn-format" (click)="exportar('csv')">
                <i class="fas fa-file-csv"></i> CSV
              </button>
              <button class="btn-format" (click)="exportar('excel')">
                <i class="fas fa-file-excel"></i> Excel
              </button>
              <button class="btn-format" (click)="exportar('pdf')">
                <i class="fas fa-file-pdf"></i> PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; border-radius: 16px; width: 480px; max-width: 90vw; max-height: 80vh; overflow-y: auto; box-shadow: 0 24px 48px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f0f0f0; }
    .modal-header h3 { margin: 0; color: #1f2937; }
    .btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; padding: 0; line-height: 1; }
    .btn-close:hover { color: #1f2937; }
    .modal-body { padding: 24px; }
    .modal-desc { color: #6b7280; margin: 0 0 20px; font-size: 14px; }
    .export-grid { display: flex; flex-direction: column; gap: 8px; }
    .export-card { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .export-card:hover { border-color: #00796b; background: #f0fdfa; }
    .export-card .card-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
    .export-card span { flex: 1; font-size: 14px; color: #374151; }
    .export-card i.fa-chevron-right { font-size: 12px; color: #9ca3af; }
    .format-select { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
    .format-select p { margin: 0 0 12px; font-size: 14px; color: #374151; }
    .format-options { display: flex; gap: 12px; }
    .btn-format { flex: 1; padding: 10px 16px; border: 1px solid #d1d5db; border-radius: 8px; background: white; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .btn-format:hover { background: #00796b; color: white; border-color: #00796b; }
  `]
})
export class ModalExportarComponent {
  @Output() close = new EventEmitter<void>();
  @Output() export = new EventEmitter<{ relatorio: string; formato: string }>();

  selecionado: any = null;

  relatorios = [
    { titulo: 'Pacientes Cadastrados', icone: 'fas fa-users', cor: '#00796b' },
    { titulo: 'Agendamentos', icone: 'fas fa-calendar-check', cor: '#1976d2' },
    { titulo: 'Atendimentos Realizados', icone: 'fas fa-stethoscope', cor: '#2e7d32' },
    { titulo: 'Evoluções por Paciente', icone: 'fas fa-notes-medical', cor: '#6a1b9a' },
    { titulo: 'Anamneses Infantis', icone: 'fas fa-child', cor: '#c62828' },
  ];

  fechar(): void {
    this.close.emit();
  }

  selecionar(item: any): void {
    this.selecionado = item;
  }

  exportar(formato: string): void {
    this.export.emit({ relatorio: this.selecionado.titulo, formato });
  }
}
