import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule ,HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    this.http.post<{ token: string }>('http://localhost:8080/auth/login', this.loginData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('auth_token', response.token);
          this.errorMessage = '';
          Swal.fire({
            icon: 'success',
            title: 'Usuário logado com sucesso',
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Usuário ou senha inválidos';
        }
      });
  }

}
