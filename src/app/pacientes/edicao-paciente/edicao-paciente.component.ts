import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edicao-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edicao-paciente.component.html',
  styleUrls: ['./edicao-paciente.component.css']
})
export class EdicaoPacienteComponent implements OnInit {
  paciente: any = {
    id: null,
    nome: '',
    idade: null,
    responsavel: '',
    observacoes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.carregarPaciente(id);
  }

  carregarPaciente(id: any) {
   
  }

  onSubmit() {
    Swal.fire({
      icon: 'success',
      title: 'Paciente atualizado com sucesso!',
      showConfirmButton: false,
      timer: 2000
    })
    this.router.navigate(['/pacientes']);
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
  }
}
