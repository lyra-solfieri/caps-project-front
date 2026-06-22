import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { AnamneseService } from '../../services/anamnese/anamnese.service';

@Component({
  selector: 'app-cadastro-anamnese',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './anamnese-infantil-cadastro.component.html',
  styleUrls: ['./anamnese-infantil-cadastro.component.css']
})
export class CadastroAnamneseComponent implements OnInit {

  anamneseForm: FormGroup;

  saving = false;
  loading = true;

  constructor(
    private anamneseService: AnamneseService,
    private router: Router,
    private route: ActivatedRoute,
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

      observacoesGerais: [''],
      historicoDeInternacao: [''],
      observacoesGestacao: [''],

      localNascimento: [''],
      tipoParto: [''],
      posicaoNascimento: [''],
      altaHospitalar: [''],

      chorouAoNascer: [false],
      nasceuVermelho: [false],
      nasceuRoxo: [false],
      anoxia: [false],
      ictericia: [false],
      precisouOxigenio: [false],
      incubadora: [false],

      sorriu: [''],
      equilibrouPescoco: [''],
      engatinhou: [''],
      sentou: [''],
      andou: [''],
      primeirasPalavras: [''],
      falaCorreta: [''],
      trocouLetras: [''],
      gaguejou: [''],
      denticao: [''],

      controleEsfincterAnalDiurno: [''],
      controleEsfincterVesicalDiurno: [''],
      controleEsfincterNoturno: [''],

      cuidadosPorQuem: [''],

      usouChupeta: [false],
      chupouDedo: [false],
      roeUnhas: [false],
      puxaOrelha: [false],
      arrancaCabelos: [false],
      mordeLabios: [false],
      tiques: [false],

      atitudeDianteHabitos: [''],

      dormeBem: [false],
      pulaQuandoDorme: [false],
      babaNoite: [false],
      sudorese: [false],
      acordaVariasVezes: [false],
      falaDormindo: [false],
      gritaDormindo: [false],
      rangeDentes: [false],
      sonambulo: [false],
      pesadelos: [false],

      amamentadoNoPeito: [false],
      atitudeDesmame: [''],
      habitosAlimentares: [''],

      comportamentoEscola: [''],
      gostaEstudar: [false],
      gostaEscola: [false],
      dificuldadeAprendizagem: [false],
      historicoEscolar: [''],
      queixasComportamento: [''],

      prefereBrincar: [''],
      ativoOuPassivo: [''],
      observacoesComportamentoSocial: [''],

      observacoesEstrategicas: [''],
      projetoTerapeuticoSingular: ['']

    });

  }

  ngOnInit(): void {

    const pacienteId = this.route.snapshot.queryParamMap.get('pacienteId');

    // if (pacienteId) {
    //   this.anamneseForm.patchValue({
    //     pacienteId: +pacienteId
    //   });
    // } else {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Selecione um paciente',
    //     text: 'Você precisa selecionar um paciente antes de cadastrar a anamnese.'
    //   }).then(() => {
    //     this.router.navigate(['/pacientes']);
    //   });
    //   return;
    // }

    this.loading = false;
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

    if (this.saving) return;

    this.saving = true;

    const payload = this.anamneseForm.getRawValue();

    this.anamneseService.criarAnamnese(payload)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Anamnese cadastrada com sucesso!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/anamnese-infantil']);
          });

        },

        error: () => {

          this.saving = false;

          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            text: 'Não foi possível salvar a anamnese.'
          });

        }

      });

  }

  cancelar() {

    this.router.navigate(['/anamnese-infantil']);

  }

  voltar() {
    this.router.navigate(['/anamnese-infantil']);
  }

  get f() {
    return this.anamneseForm.controls as any;
  }

}