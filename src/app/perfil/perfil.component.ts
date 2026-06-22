import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../services/user/user.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  user: UserDto | null = null;
  isAdmin = false;
  editando = false;
  editForm!: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.editForm = this.fb.group({
      email: [''],
      nome: ['']
    });
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.editForm.patchValue({
          email: user.email,
          nome: user.nome
        });
      }
    });
  }

  alternarEdicao(): void {
    this.editando = !this.editando;
    if (this.editando && this.user) {
      this.editForm.patchValue({
        email: this.user.email,
        nome: this.user.nome
      });
    }
  }

  salvar(): void {
    this.userService.updateProfile(this.editForm.value).subscribe({
      next: (user) => {
        this.user = user;
        this.editando = false;
      }
    });
  }
}
