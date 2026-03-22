import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from "../app-header/app-header.component";
import { AnamneseDTO } from '../services/anamnese/anamnese.model';
import { Router } from '@angular/router';
import { AnamneseService } from '../services/anamnese/anamnese.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../services/paciente/paciente.service';
import { PacienteDto } from '../services/paciente/paciente.model';

@Component({
  selector: 'app-anamnese-infantil',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent],
  templateUrl: './anamnese-infantil.component.html',
  styleUrl: './anamnese-infantil.component.css'
})
export class AnamneseInfantilComponent implements OnInit {

  anamnese: AnamneseDTO[] = [];

  pageNo = 0;
  pageSize = 10;
  totalElements = 0;

  loading = false;
  

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
          this.anamnese = res.content;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Erro', 'Erro ao carregar anamneses', 'error');
        }
      });

  }

  addAnamnese() {

    this.pacienteService.listarPacientes(this.pageNo, this.pageSize, '', '').subscribe({

    next: (response: any) => {

      const pacientes = response.content;

      const options: any = {};

      pacientes.forEach((p: PacienteDto) => {
        options[p.id!] = p.nome;
      });

      Swal.fire({
        title: 'Selecione o Paciente',
        input: 'select',
        inputOptions: options,
        inputPlaceholder: 'Escolha um paciente',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then(result => {

        if (result.isConfirmed && result.value) {

          this.router.navigate(['/anamnese-infantil/cadastrar'], {
            queryParams: { pacienteId: result.value }
          });

        }

      });

    },

      error: () => {
        Swal.fire('Erro', 'Erro ao carregar pacientes', 'error');
      }

    });

  }

  editar(anamnese: AnamneseDTO) {
    this.router.navigate(['/anamnese-infantil/editar', anamnese.id]);
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