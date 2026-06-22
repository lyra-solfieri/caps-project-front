import { Component, OnInit } from '@angular/core';
import { RaasService } from '../../services/raas/raas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelecionarPacienteModalComponent } from "../../modal/paciente/selecionar-paciente-modal/selecionar-paciente-modal.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-raas-listar',
  standalone: true,
  imports: [
    CommonModule, 
    SelecionarPacienteModalComponent
  ],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class RaasListarComponent implements OnInit {

  raasList: any[] = [];

  pageNo = 0;
  pageSize = 5;
  totalPages = 0;

  isFirst = false;
  isLast = false;
  mostrarModal = false;

  constructor(
    private raasService: RaasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.listarRaas();
  }

  // listarRaas() {
  //   this.raasService.listarPaginado(this.pageNo, this.pageSize)
  //     .subscribe({
  //       next: (res) => {
  //         this.raasList = res.content;
  //         this.totalPages = res.totalPages;
  //         this.isFirst = res.first;
  //         this.isLast = res.last;
  //       },
  //       error: (err) => {
  //         console.error('Erro ao listar RAAS', err);
  //       }
  //     });
  // }

  novoRaas() {
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }


  onPacienteSelecionado(pacienteId: number) {
    if (!pacienteId) return;

    this.mostrarModal = false;
    this.router.navigate(['/raas/novo', pacienteId]);
  }


  editar(id: number) {
    this.router.navigate(['/raas/editar', id]);
  }

  gerarPdf(id: number) {
    this.raasService.gerarPdf(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
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
      this.raasService.deletar(id).subscribe(() => {
        // this.listarRaas();
      });
    }});

  }

  // paginaAnterior() {
  //   if (this.pageNo > 0) {
  //     this.pageNo--;
  //     this.listarRaas();
  //   }
  // }

  // proximaPagina() {
  //   if (!this.isLast) {
  //     this.pageNo++;
  //     this.listarRaas();
  //   }
  // }

  // irParaPagina(page: number) {
  //   this.pageNo = page;
  //   this.listarRaas();
  // }
}


