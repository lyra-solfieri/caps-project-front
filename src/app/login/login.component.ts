import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.authService.login(this.loginData)
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.errorMessage = '';
          Swal.fire({
            icon: 'success',
            title: 'Usuário logado com sucesso',
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          if (err.status === 429) {
            this.errorMessage = err.error?.message || 'Muitas tentativas. Aguarde alguns minutos.';
          } else {
            this.errorMessage = 'Usuário ou senha inválidos';
          }
        }
      });
  }

}
