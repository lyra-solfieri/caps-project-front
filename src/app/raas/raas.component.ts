import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from '../app-header/app-header.component'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PacienteDto, PacienteService } from '../services/paciente/paciente.service';

@Component({
  selector: 'app-raas',
  imports: [
    AppHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './raas.component.html',
  styleUrl: './raas.component.css'
})
export class RaasComponent implements OnInit {

  raasForm!: FormGroup;
  paciente: any;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {

    this.raasForm = this.fb.group({
      nomeEstabelecimento: [''],
      cnes: [''],
      nomePaciente: [''],
      numeroProntuario: [''],
      cartaoSus: [''],
      dataNascimento: [''],
      sexo: [''],
      racaCor: [''],
      nacionalidade: [''],
      nomeMae: [''],
      municipio: [''],
      uf: [''],
      cep: [''],
      endereco: [''],
      complemento: [''],
      telefone: ['']
    });
    
  }

  // buscarPaciente(pacienteId: number) {
  //   this.pacienteService.buscarPacientePorId(pacienteId).subscribe({
  //     next: (paciente: PacienteDto) => {
  //       console.log("🚀 ~ RaasComponent ~ buscarPaciente ~ paciente:", paciente);
        
  //       this.raasForm.patchValue({
  //         nomeEstabelecimento: paciente.nome,
  //         // cnes: paciente.cnes,
  //         numeroProntuario: paciente.numeroProntuario,
  //         nomePaciente: paciente.nome,
  //         numeroCartaoSUS: paciente.numeroCartaoSUS,
  //         sexo: paciente.genero,
  //         dataNascimento: paciente.dataNascimento,
  //         // nacionalidade: paciente.nacionalidade,
  //         raca: paciente.raca,
  //         nomeMae: paciente.nomeMae
  //       });
  //     }
  //   })
    
  // }

   exportarPDF() {
    
  }

}
