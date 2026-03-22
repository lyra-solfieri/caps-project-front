import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { AppHeaderComponent } from '../../app-header/app-header.component';
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { AnamneseService } from '../../services/anamnese/anamnese.service';

@Component({
  selector: 'app-editar-anamnese',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppHeaderComponent,
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

        if (data.dataRegistro) {
          data.dataRegistro = data.dataRegistro.substring(0, 16);
        }

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

      Swal.fire('Formulário inválido', 'Preencha os campos obrigatórios.', 'warning');
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

        error: () => {
          this.saving = false;

          Swal.fire(
            'Erro',
            'Não foi possível atualizar a anamnese.',
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