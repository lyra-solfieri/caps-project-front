import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { AnamneseService } from '../../services/anamnese/anamnese.service';
import { PacienteService } from '../../services/paciente/paciente.service';

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
  nomePaciente = '';

  constructor(
    private anamneseService: AnamneseService,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.anamneseForm = this.fb.group({

      pacienteId: [null, Validators.required],

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

    const pacienteId = this.route.snapshot.queryParamMap.get('pacienteId');

    if (pacienteId) {
      this.anamneseForm.patchValue({
        pacienteId: +pacienteId
      });

      this.pacienteService.buscarPacientePorId(+pacienteId).subscribe({
        next: (paciente) => {
          this.nomePaciente = paciente.nome;
          this.loading = false;
        },
        error: () => {
          this.nomePaciente = 'Paciente #' + pacienteId;
          this.loading = false;
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Selecione um paciente',
        text: 'Você precisa selecionar um paciente antes de cadastrar a anamnese.'
      }).then(() => {
        this.router.navigate(['/anamnese-infantil']);
      });
    }

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

        error: (err) => {

          this.saving = false;

          const mensagem = err.error?.message || 'Não foi possível salvar a anamnese.';

          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            text: mensagem
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