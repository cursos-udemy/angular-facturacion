import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { AuthGuard } from './auth.guard';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      if (!this.authGuard.canActivate(next, state)) return false;
  
      const role = next.data['role'] as string;
      if (!this.auth.hasRole(role)){
        Swal.fire('Acceso Denegado', 'No tienes permisos para ejecutar esta acción', 'warning');
        this.router.navigateByUrl("/customers");
        return false;
      }
      return true;
    }
  
}
