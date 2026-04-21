import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from '../../app-header/app-header.component'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente/paciente.service';
import { PacienteDto } from '../../services/paciente/paciente.model';
import { RaasService } from '../../services/raas/raas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-raas',
  imports: [
    AppHeaderComponent,
    ReactiveFormsModule,
    CommonModule
  ],
templateUrl: './raas.component.html',
styleUrls: ['./raas.component.css']
})
export class RaasComponent implements OnInit {

  raasForm!: FormGroup;
  paciente!: PacienteDto;
  raasId!: number;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private raasService: RaasService
  ) {}

  ngOnInit(): void {

    this.raasForm = this.fb.group({
      nomeEstabelecimento: [''],
      cnes: [''],
      numeroProntuario: [''],
      nomePaciente: [''],
      cartaoSus: [''],
      sexo: [''],
      dataNascimento: [''],
      nomeMae: [''],

      dataAdmissao: [''],
      mesAtendimento: [''],
      numeroAutorizacao: [''],

      acoesRealizadas: this.fb.array([])
    });

    this.adicionarAcao();
  }


  get acoes(): FormArray {
    return this.raasForm.get('acoesRealizadas') as FormArray;
  }

  novaAcao(): FormGroup {
    return this.fb.group({
      codigoAcao: [''],
      quantidade: [''],
      data: [''],
      servico: [''],
      classificacao: [''],
      cboExecutor: [''],
      cartaoProfissional: [''],
      caps: [false],
      territorio: [false]
    });
  }

  adicionarAcao() {
    this.acoes.push(this.novaAcao());
  }

  removerAcao(index: number) {
    if (this.acoes.length > 1) {
      this.acoes.removeAt(index);
    }
  }

  buscarPaciente(pacienteId: number) {
    this.pacienteService.buscarPacientePorId(pacienteId).subscribe({
      next: (paciente: PacienteDto) => {

        this.paciente = paciente;

        this.raasForm.patchValue({
          numeroProntuario: paciente.numeroProntuario,
          nomePaciente: paciente.nome,
          cartaoSus: paciente.numeroCartaoSUS,
          sexo: paciente.genero,
          dataNascimento: paciente.dataNascimento,
          nomeMae: paciente.nomeMae,

          telefoneCelular: paciente.telefone,
          endereco: paciente.endereco?.logradouro,
          municipio: paciente.endereco?.cidade,
          uf: paciente.endereco?.estado
        });
      },
      error: (err) => {
        console.error('Erro ao buscar paciente', err);
      }
    });
  }


  salvarRaas() {

    const dto = {
      pacienteId: this.paciente.id,
      atendimentoId: 1,

      nomeEstabelecimento: this.raasForm.value.nomeEstabelecimento,
      cnes: this.raasForm.value.cnes,

      acoes: this.raasForm.value.acoesRealizadas
    };

    // this.raasService.criar(dto).subscribe({
    //   next: (res) => {
    //     console.log('RAAS criado:', res);
    //     this.raasId = res.id;
    //   }
    // });
  }

  exportarPDF() {

    if (!this.raasId) {
      alert('Salve o RAAS antes de gerar o PDF');
      return;
    }

    this.raasService.gerarPdf(this.raasId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err) => {
        console.error('Erro ao gerar PDF', err);
      }
    });
  }

}