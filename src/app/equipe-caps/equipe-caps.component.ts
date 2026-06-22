import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user/user.service';
import { UserDto } from '../services/user/user.model';

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
  roles = ['USER', 'ADMIN', 'MODERATOR', 'EDITOR', 'GUEST'];
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_USER', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    const role = this.authService.getUserRole();

    if (this.isAdmin) {
      this.userService.listarUsuarios().subscribe({
        next: (users) => {
          this.usuarios = users;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    } else {
      this.userService.listarPorRole(role ?? 'USER').subscribe({
        next: (users) => {
          this.usuarios = users;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Usuário registrado com sucesso!');
          this.registerForm.reset({ role: 'ROLE_USER' });
          this.exibirFormulario = false;
          this.carregarUsuarios();
        },
        error: (err) => console.error('Erro ao registrar', err)
      });
    }
  }

  alternarFormulario(): void {
    this.exibirFormulario = !this.exibirFormulario;
  }
}
