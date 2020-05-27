import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../security/auth.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err['status'] == 401) {
          //if (this.auth.isAuthenticated()) {
          //}
          this.auth.logout();
          this.router.navigateByUrl("/login");
        }
        if (err['status'] == 403) {
          Swal.fire('', 'No tienes permisos para ejecutar esta acción', 'warning');
          this.router.navigateByUrl("/customers");
        }
        return throwError(err);
      }));
  }
}