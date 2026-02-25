// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule, AppHeaderComponent],
  templateUrl: './equipe-caps.component.html',
  styleUrls: ['./equipe-caps.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  roles = ['USER', 'ADMIN', 'MODERATOR','EDITOR','GUEST'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_USER', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Usuário registrado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => console.error('Erro ao registrar', err)
      });
    }
  }
}