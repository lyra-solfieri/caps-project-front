import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { PacienteService } from '../../../services/paciente/paciente.service';


@Component({
  selector: 'app-selecionar-paciente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selecionar-paciente-modal.component.html',
  styleUrls: ['./selecionar-paciente-modal.component.css']
})
export class SelecionarPacienteModalComponent {

  @Output() fechado = new EventEmitter<void>();
  @Output() selecionado = new EventEmitter<number>();

  termo: string = '';
  pacientes: any[] = [];
  loading = false;

  private searchSubject = new Subject<string>();

  constructor(private pacienteService: PacienteService) {

    this.searchSubject.pipe(
      debounceTime(400)
    ).subscribe(value => {
      this.buscar(value);
    });

  }

  onSearch() {
    this.searchSubject.next(this.termo);
  }

  buscar(termo: string) {

    this.loading = true;

    this.pacienteService.listarPacientes(0, 10, termo, '')
      .subscribe({
        next: (res: any) => {
          this.pacientes = res.content;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });

  }

  selecionar(id: number) {
    this.selecionado.emit(id);
  }

  fechar() {
    this.fechado.emit();
  }

}