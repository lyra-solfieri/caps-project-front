import { Component, OnInit } from '@angular/core';
import { RaasService } from '../../services/raas/raas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelecionarPacienteModalComponent } from "../../modal/paciente/selecionar-paciente-modal/selecionar-paciente-modal.component";
import { OcrService } from '../../services/raas/ocr.service';
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
  processandoOcr = false;

  constructor(
    private raasService: RaasService,
    private ocrService: OcrService,
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

  importarRaasEscaneado() {
    if (this.processandoOcr) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.png,.jpg,.jpeg,.tiff';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;

      this.processandoOcr = true;
      this.ocrService.upload(file).subscribe({
        next: (resp) => {
          const correlationId = resp.correlationId;
          Swal.fire({
            title: 'Processando RAAS',
            html: 'Extraindo dados do documento escaneado...<br><small>Isso pode levar alguns segundos</small>',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
          });

          let tentativas = 0;
          const maxTentativas = 30;
          const interval = setInterval(() => {
            tentativas++;

            if (tentativas > maxTentativas) {
              clearInterval(interval);
              this.processandoOcr = false;
              Swal.fire('Tempo esgotado', 'O processamento demorou mais do que o esperado. Tente novamente.', 'warning');
              return;
            }

            this.ocrService.status(correlationId).subscribe({
              next: (status) => {
                if (status.status === 'CONCLUIDO' || status.status === 'REVISAO_MANUAL') {
                  clearInterval(interval);
                  this.processandoOcr = false;
                  Swal.close();
                  this.router.navigate(['/raas/importar', correlationId]);
                } else if (status.status === 'FALHA') {
                  clearInterval(interval);
                  this.processandoOcr = false;
                  this.mostrarErroFalha(correlationId);
                }
              },
              error: () => {
                clearInterval(interval);
                this.processandoOcr = false;
                Swal.fire('Erro', 'Falha ao consultar status do processamento', 'error');
              }
            });
          }, 3000);
        },
        error: () => {
          this.processandoOcr = false;
          Swal.fire('Erro', 'Falha ao enviar o documento para processamento', 'error');
        }
      });
    };
    input.click();
  }

  private mostrarErroFalha(correlationId: string) {
    this.ocrService.resultado(correlationId).subscribe({
      next: (result) => {
        const erros = result?.erros?.join(', ') || 'erro desconhecido';
        Swal.fire('Erro', 'Falha ao processar o documento: ' + erros, 'error');
      },
      error: () => {
        Swal.fire('Erro', 'Falha ao processar o documento: erro desconhecido', 'error');
      }
    });
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


