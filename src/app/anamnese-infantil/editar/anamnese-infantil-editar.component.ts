import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { AnamneseService } from '../../services/anamnese/anamnese.service';

@Component({
  selector: 'app-editar-anamnese',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './anamnese-infantil-editar.component.html',
  styleUrls: ['./anamnese-infantil-editar.component.css']
})
export class EdicaoAnamneseComponent implements OnInit {

  anamneseForm: FormGroup;

  loading = true;
  saving = false;

  private anamneseId!: number;

  constructor(
    private anamneseService: AnamneseService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.anamneseForm = this.fb.group({

      id: [null],

      pacienteId: [{ value: null, disabled: true }, Validators.required],

      profissionalResponsavel: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],

      queixaPrincipal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]],
      historiaDoencaAtual: ['', Validators.maxLength(2000)],
      encaminhamentos: ['', Validators.maxLength(1000)],

      antecedentesFamiliares: ['', Validators.maxLength(1000)],
      habitosDeVida: ['', Validators.maxLength(1000)],
      alergias: ['', Validators.maxLength(200)],
      cirurgias: ['', Validators.maxLength(200)],
      medicamentosUsados: ['', Validators.maxLength(1000)],

      observacoesGerais: ['', Validators.maxLength(1000)],
      historicoDeInternacao: ['', Validators.maxLength(1000)],
      observacoesGestacao: ['', Validators.maxLength(1000)],

      localNascimento: ['', Validators.maxLength(100)],
      tipoParto: ['', Validators.maxLength(100)],
      posicaoNascimento: ['', Validators.maxLength(100)],
      altaHospitalar: ['', Validators.maxLength(100)],

      chorouAoNascer: [false],
      nasceuVermelho: [false],
      nasceuRoxo: [false],
      anoxia: [false],
      ictericia: [false],
      precisouOxigenio: [false],
      incubadora: [false],

      sorriu: [false],
      engatinhou: [false],
      sentou: [false],
      andou: [false],
      equilibrouPescoco: [false],
      primeirasPalavras: ['', Validators.maxLength(50)],
      falaCorreta: [false],
      trocouLetras: [false],
      gaguejou: [false],
      denticao: [false],

      controleEsfincterAnalDiurno: ['', Validators.maxLength(100)],
      controleEsfincterVesicalDiurno: ['', Validators.maxLength(100)],
      controleEsfincterNoturno: ['', Validators.maxLength(100)],

      cuidadosPorQuem: ['', Validators.maxLength(200)],

      usouChupeta: [false],
      chupouDedo: [false],
      roeUnhas: [false],
      puxaOrelha: [false],
      arrancaCabelos: [false],
      mordeLabios: [false],
      tiques: [false],

      atitudeDianteHabitos: ['', Validators.maxLength(1000)],

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
      atitudeDesmame: ['', Validators.maxLength(1000)],
      habitosAlimentares: ['', Validators.maxLength(1000)],

      comportamentoEscola: ['', Validators.maxLength(1000)],
      gostaEstudar: [false],
      gostaEscola: [false],
      dificuldadeAprendizagem: [false],
      historicoEscolar: ['', Validators.maxLength(1000)],
      queixasComportamento: ['', Validators.maxLength(1000)],

      prefereBrincar: ['', Validators.maxLength(100)],
      ativoOuPassivo: ['', Validators.maxLength(100)],
      observacoesComportamentoSocial: ['', Validators.maxLength(1000)],

      observacoesEstrategicas: ['', Validators.maxLength(1000)],
      projetoTerapeuticoSingular: ['', Validators.maxLength(1000)]

    });

  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.handleError('ID da anamnese não informado');
      return;
    }

    this.anamneseId = +id;

    this.carregarAnamnese();
  }

  carregarAnamnese() {

    this.loading = true;

    this.anamneseService.buscarPorId(this.anamneseId).subscribe({

      next: (data) => {

        this.anamneseForm.patchValue(data);

        this.loading = false;
      },

      error: () => {
        this.handleError('Erro ao carregar anamnese');
      }

    });

  }

  onSubmit() {

    if (this.anamneseForm.invalid) {
      this.anamneseForm.markAllAsTouched();

      const campos: string[] = [];
      const c = this.anamneseForm.controls;

      if (c['profissionalResponsavel'].invalid) campos.push('Profissional Responsável');
      if (c['queixaPrincipal'].invalid) campos.push('Queixa Principal');

      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        html: `Preencha os campos obrigatórios:<br><strong>${campos.join('</strong>, <strong>')}</strong>`
      });
      return;
    }

    if (this.saving) return;

    this.saving = true;

    const payload = this.anamneseForm.getRawValue();

    this.anamneseService.editarAnamnese(this.anamneseId, payload)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Anamnese atualizada com sucesso!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/anamnese-infantil']);
          });

        },

        error: (err) => {
          this.saving = false;

          const mensagem = err.error?.message || 'Não foi possível atualizar a anamnese.';

          Swal.fire(
            'Erro',
            mensagem,
            'error'
          );
        }

      });

  }

  handleError(message: string) {

    Swal.fire('Erro', message, 'error');

    this.router.navigate(['/anamnese-infantil']);
  }

  cancelar() {
    this.router.navigate(['/anamnese-infantil']);
  }

  get f() {
    return this.anamneseForm.controls as any;
  }

}