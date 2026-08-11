import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user/user.service';
import { UserDto } from '../services/user/user.model';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './equipe-caps.component.html',
  styleUrls: ['./equipe-caps.component.css']
})
export class RegisterComponent implements OnInit {
  usuarios: UserDto[] = [];
  registerForm: FormGroup;
  isAdmin = false;
  loading = false;
  exibirFormulario = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nome: ['', Validators.required],
      profissao: ['', Validators.required],
      role: ['USER', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.userService.listarUsuarios().subscribe({
      next: (users) => {
        this.usuarios = users;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

 onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Usuário registrado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          });
          
          this.registerForm.reset();
          this.exibirFormulario = false;
          this.carregarUsuarios();
        },
        
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao registrar', err);

          let mensagemErro = 'Ocorreu um erro ao registrar o usuário.';
          
          if (err.error && err.error.message) {
            mensagemErro = err.error.message;
          } else if (typeof err.error === 'string') {
            mensagemErro = err.error;
          } else if (err.status === 400) {
            mensagemErro = 'Verifique se a senha atende aos requisitos mínimos (maiúscula, minúscula, número e caractere especial).';
          }

          Swal.fire({
            icon: 'error',
            title: 'Erro no Cadastro',
            text: mensagemErro,
            confirmButtonColor: '#00796b'
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  alternarFormulario(): void {
    this.exibirFormulario = !this.exibirFormulario;
  }
}
