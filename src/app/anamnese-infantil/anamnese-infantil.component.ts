import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from "../app-header/app-header.component";
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
  imports: [CommonModule, AppHeaderComponent, SelecionarPacienteModalComponent],
  templateUrl: './anamnese-infantil.component.html',
  styleUrl: './anamnese-infantil.component.css'
})
export class AnamneseInfantilComponent implements OnInit {

  anamnese: AnamneseDTO[] = [];

  pageNo = 0;
  pageSize = 10;
  totalElements = 0;

  loading = false;
  mostrarModal = false;

  
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
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Erro', 'Erro ao carregar anamneses', 'error');
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
    this.pageNo++;
    this.buscarAnamneses();
  }

  paginaAnterior() {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.buscarAnamneses();
    }
  }

}