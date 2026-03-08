import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppHeaderComponent } from "../app-header/app-header.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Evolucao {
  id?: number;
  pacienteId?: number;
  codProntuario?: number;
  texto: string;
  profissional?: string;
  dataEvolucao: Date;
}

@Component({
  selector: 'app-evolucao',
  templateUrl: './evolucao.component.html',
  styleUrls: ['./evolucao.component.css'],
  imports: [AppHeaderComponent,ReactiveFormsModule,CommonModule]
})
export class EvolucaoComponent implements OnInit {
  @Input() pacienteId?: number;
  @Input() pacienteNome?: string;
  @Input() codProntuario?: number;

  evolucoes: Evolucao[] = [];
  evolucaoEmEdicao: Evolucao | null = null;
  evolucaoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.evolucaoForm = this.fb.group({
      texto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      paciente: ['']      
    });
  }

  ngOnInit(): void {
    this.carregarEvolucoes();
  }

  // Getter para facilitar acesso no template
  get texto() { return this.evolucaoForm.get('texto'); }

  carregarEvolucoes(): void {
    // Simulando dados iniciais - substituir por chamada HTTP real
    this.evolucoes = [
      {
        id: 1,
        texto: 'Paciente relatou melhora significativa após início do novo medicamento. Sinais vitais estáveis e bem orientado.',
        profissional: 'Dra. Ana Silva',
        dataEvolucao: new Date('2024-03-15T10:30:00'),
       
      },
      {
        id: 2,
        texto: 'Paciente apresenta boa evolução, sem queixas. Foi orientado sobre a continuidade do tratamento.',
        profissional: 'Dr. Carlos Santos',
        dataEvolucao: new Date('2024-03-14T14:20:00')
      },
      {
        id: 3,
        texto: 'Paciente internado para observação. Exames laboratoriais solicitados. Aguardando resultados.',
        profissional: 'Dra. Ana Silva',
        dataEvolucao: new Date('2024-03-13T09:15:00')
      }
    ];

    // Ordenar por data decrescente
    this.evolucoes.sort((a, b) => 
      new Date(b.dataEvolucao).getTime() - new Date(a.dataEvolucao).getTime()
    );
  }

  getPaciente(): string {
    return this.pacienteNome || '';
  }

  selecionarEvolucao(evolucao: Evolucao): void {
    // Se clicar em uma evolução que não está sendo editada, faz nada
    if (!this.evolucaoEmEdicao || this.evolucaoEmEdicao.id !== evolucao.id) {
      return;
    }
  }

  editarEvolucao(evolucao: Evolucao, event: Event): void {
    event.stopPropagation(); // Previne o clique no card
    this.evolucaoEmEdicao = { ...evolucao };
    this.evolucaoForm.patchValue({
      texto: evolucao.texto,
      profissional: evolucao.profissional
    });
  }

  excluirEvolucao(evolucao: Evolucao, event: Event): void {
    event.stopPropagation(); // Previne o clique no card
    
    if (confirm('Tem certeza que deseja excluir esta evolução?')) {
      this.evolucoes = this.evolucoes.filter(e => e.id !== evolucao.id);
      
      // Se estava editando esta evolução, cancelar edição
      if (this.evolucaoEmEdicao?.id === evolucao.id) {
        this.cancelarEdicao();
      }
    }
  }

  salvarEvolucao(): void {
    if (this.evolucaoForm.valid) {
      const dadosForm = this.evolucaoForm.value;
      
      if (this.evolucaoEmEdicao) {
        // Atualizar evolução existente
        const index = this.evolucoes.findIndex(e => e.id === this.evolucaoEmEdicao?.id);
        if (index !== -1) {
          this.evolucoes[index] = {
            ...this.evolucoes[index],
            texto: dadosForm.texto,
            profissional: dadosForm.profissional
          };
        }
      } else {
        // Criar nova evolução
        const novaEvolucao: Evolucao = {
          id: this.evolucoes.length + 1,
          pacienteId: this.pacienteId,
          codProntuario: this.codProntuario,
          texto: dadosForm.texto,
          profissional: dadosForm.profissional,
          dataEvolucao: new Date()
        };
        
        this.evolucoes.unshift(novaEvolucao); // Adiciona no início
      }

      // Resetar formulário
      this.cancelarEdicao();
    }
  }

  cancelarEdicao(): void {
    this.evolucaoEmEdicao = null;
    this.evolucaoForm.reset();
  }
}