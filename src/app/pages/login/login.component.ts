import { Component, OnInit } from '@angular/core';
import { UserInput } from './user.input';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public userInput: UserInput
  public rememberMe = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl("/customers");
    }

    this.userInput = new UserInput();
    if (localStorage.getItem('username')) {
      this.userInput.username = localStorage.getItem('username');
      this.rememberMe = true;
    }
  }

  public login(form: NgForm) {
    if (form.invalid) return;

    Swal.fire({
      allowOutsideClick: false,
      text: 'Autenticando usuario...',
      icon: 'info'
    });
    Swal.showLoading();

    this.auth.login(this.userInput).subscribe(
      resp => {
        Swal.close();
        if (this.rememberMe) localStorage.setItem('username', this.auth.user.username);
        this.router.navigateByUrl('/customers');
      },
      err => {
        const message = (err.status == 400) ? 'Usuario o Pasword incorrecto' : 'Servicio no disponible';
        Swal.fire({
          allowOutsideClick: false,
          text: message,
          icon: 'error'
        });
      }
    );
  }
}
