import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';



import { AppHeaderComponent } from '../../app-header/app-header.component';
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { AnamneseService } from '../../services/anamnese/anamnese.service';

@Component({
  selector: 'app-cadastro-anamnese',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppHeaderComponent,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './anamnese-infantil-cadastro.component.html',
  styleUrls: ['./anamnese-infantil-cadastro.component.css']
})
export class CadastroAnamneseComponent {

  anamneseForm: FormGroup;

  constructor(
    private anamneseService: AnamneseService,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.anamneseForm = this.fb.group({

      pacienteId: [null, Validators.required],

      profissionalResponsavel: ['', Validators.required],

      dataRegistro: [''],

      queixaPrincipal: ['', Validators.required],
      historiaDoencaAtual: [''],
      encaminhamentos: [''],

      antecedentesFamiliares: [''],
      habitosDeVida: [''],

      alergias: [''],
      cirurgias: [''],
      medicamentosUsados: [''],

      localNascimento: [''],
      tipoParto: [''],
      posicaoNascimento: [''],

      chorouAoNascer: [false],
      nasceuVermelho: [false],
      nasceuRoxo: [false],
      anoxia: [false],
      ictericia: [false],
      precisouOxigenio: [false],
      incubadora: [false],

      sorriu: [''],
      engatinhou: [''],
      sentou: [''],
      andou: [''],

      usouChupeta: [false],
      chupouDedo: [false],
      roeUnhas: [false],
      arrancaCabelos: [false],
      mordeLabios: [false],
      tiques: [false],

      atitudeDianteHabitos: [''],

      dormeBem: [false],
      falaDormindo: [false],
      gritaDormindo: [false],
      rangeDentes: [false],
      sonambulo: [false],
      pesadelos: [false],

      comportamentoEscola: [''],
      gostaEstudar: [false],
      gostaEscola: [false],
      dificuldadeAprendizagem: [false],
      historicoEscolar: [''],

      prefereBrincar: [''],
      ativoOuPassivo: [''],

      observacoesComportamentoSocial: [''],

      observacoesEstrategicas: [''],
      projetoTerapeuticoSingular: ['']

    });

  }


  onSubmit() {

    if (this.anamneseForm.invalid) {

      this.anamneseForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Preencha os campos obrigatórios.'
      });

      return;
    }

    // this.anamneseService.criarAnamnese(this.anamneseForm.value)
    //   .subscribe({

    //     next: () => {

    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Anamnese cadastrada!',
    //         showConfirmButton: false,
    //         timer: 2000
    //       }).then(() => {
    //         this.router.navigate(['/pacientes']);
    //       });

    //     },

    //     error: (err: any) => {

    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Erro ao cadastrar anamnese',
    //         text: err.error
    //       });

    //     }

    //   });

  }

  cancelar() {

    this.router.navigate(['/dashboard']);

    Swal.fire({
      icon: 'warning',
      title: 'Cadastro cancelado',
      showConfirmButton: false,
      timer: 2000
    });

  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }


  listaPacientes() {
    this.router.navigate(['/pacientes']);
  }


  get f() {
    return this.anamneseForm.controls as any;
  }

}