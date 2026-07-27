import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('auth_token');
          this.router.navigate(['/login']);
          Swal.fire({
            icon: 'warning',
            title: 'Sessão expirada',
            text: 'Faça login novamente.',
            timer: 3000,
            showConfirmButton: false
          });
        } else if (error.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Acesso negado',
            text: 'Você não tem permissão para realizar esta ação.',
            timer: 3000,
            showConfirmButton: false
          });
        } else if (error.status === 429) {
          Swal.fire({
            icon: 'warning',
            title: 'Muitas tentativas',
            text: 'Aguarde alguns minutos antes de tentar novamente.',
            timer: 5000,
            showConfirmButton: false
          });
        }

        return throwError(() => error);
      })
    );
  }
}
