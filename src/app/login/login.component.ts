import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, RequiredValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: ['', RequiredValidator],
    password: ['', RequiredValidator]
  };

  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    this.http.post<{ token: string }>('http://localhost:8080/auth/login', this.loginData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.errorMessage = '';
          alert('Login efetuado com sucesso!');// TODO: Adicionar um SweetAlert
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Usuário ou senha inválidos';
        }
      });
  }

}
