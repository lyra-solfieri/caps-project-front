import { Component, OnInit } from '@angular/core';
import { AnamneseDTO } from '../services/anamnese/anamnese.model';
import { Router } from '@angular/router';
import { AnamneseService } from '../services/anamnese/anamnese.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../services/paciente/paciente.service';
import { SelecionarPacienteModalComponent } from "../modal/paciente/selecionar-paciente-modal/selecionar-paciente-modal.component";

@Component({
  selector: 'app-anamnese-infantil',
  standalone: true,
  imports: [CommonModule, SelecionarPacienteModalComponent],
  templateUrl: './anamnese-infantil.component.html',
  styleUrl: './anamnese-infantil.component.css'
})
export class AnamneseInfantilComponent implements OnInit {

  anamnese: AnamneseDTO[] = [];

  pageNo = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isFirst = true;
  isLast = false;

  loading = false;
  mostrarModal = false;

  nomesPacientes: { [id: number]: string } = {};

  
  constructor(
    private router: Router,
    private anamneseService: AnamneseService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.buscarAnamneses();
  }

  buscarAnamneses() {

    this.loading = true;    

    this.anamneseService.listarAnamneses(this.pageNo, this.pageSize)
      .subscribe({
        next: (res: any) => {
         
          this.anamnese = res;
          this.totalElements = res.length;
          this.totalPages = Math.ceil(this.totalElements / this.pageSize);
          this.isFirst = this.pageNo === 0;
          this.isLast = (this.pageNo + 1) * this.pageSize >= this.totalElements;

          this.carregarNomesPacientes();

          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Erro', 'Erro ao carregar anamneses', 'error');
        }
      });

  }

  carregarNomesPacientes() {
    const idsUnicos = [...new Set(this.anamnese.map(a => a.pacienteId).filter(id => id != null))];

    idsUnicos.forEach(id => {
      if (!this.nomesPacientes[id!]) {
        this.pacienteService.buscarPacientePorId(id!).subscribe({
          next: (paciente) => {
            this.nomesPacientes = { ...this.nomesPacientes, [id!]: paciente?.nome || ('Paciente #' + id) };
          },
          error: () => {
            this.nomesPacientes = { ...this.nomesPacientes, [id!]: 'Paciente #' + id };
          }
        });
      }
    });
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  addAnamnese() {
    this.mostrarModal = true;
  }

  onPacienteSelecionado(id: number) {
    this.mostrarModal = false;

    this.router.navigate(['/anamnese-infantil/cadastrar'], {
      queryParams: { pacienteId: id }
    });
  }

  editar(id: number) {
    this.router.navigate(['/anamnese-infantil/editar', id]);
  }

  deletar(id: number) {

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar'
    }).then(result => {

      if (result.isConfirmed) {

        this.anamneseService.excluirAnamnese(id).subscribe({
          next: () => {
            Swal.fire('Deletado!', '', 'success');
            this.buscarAnamneses();
          },
          error: () => {
            Swal.fire('Erro', 'Erro ao deletar', 'error');
          }
        });

      }

    });

  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  proximaPagina() {
    if (!this.isLast) {
      this.pageNo++;
      this.buscarAnamneses();
    }
  }

  paginaAnterior() {
    if (!this.isFirst) {
      this.pageNo--;
      this.buscarAnamneses();
    }
  }

  irParaPagina(pagina: number) {
    this.pageNo = pagina;
    this.buscarAnamneses();
  }

}
