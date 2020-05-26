import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public logout(): void {
    this.auth.logout();
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Se ha cerrado la sesión'
    });
    this.router.navigateByUrl('/login');
  }

}
