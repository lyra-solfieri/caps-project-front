import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { Genero } from '../../enums/genero.enum';
import { Raca } from '../../enums/raca.enum';
import { PacienteDto, PacienteService } from '../../services/paciente/paciente.service';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: ['./cadastro-paciente.component.css']
})
export class CadastroPacienteComponent {
  generos = Object.values(Genero);
  racas = Object.values(Raca);

  paciente: PacienteDto = {
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    genero: '',
    nomeMae: '',
    nomePai: '',
    profissao: '',
    numeroCartaoSUS: '',
    raca: '',
    numeroProntuario: undefined,
    infantojuvenil: false,
    emSituacaoSocioeconomica: false,
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: ''
    }
     
  };

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  onSubmit() {
    this.pacienteService.criarPaciente(this.paciente).subscribe({
      next: (res) => {
        console.log('Paciente cadastrado:', res);
        alert('Paciente cadastrado com sucesso!');
        this.router.navigate(['/pacientes']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar paciente:', err);
        alert('Erro ao cadastrar paciente. Verifique os dados.');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }
}
