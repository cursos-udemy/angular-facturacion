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

  user: UserInput
  rememberMe = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new UserInput();
    if (localStorage.getItem('item')) {
      this.user.username = localStorage.getItem('username');
      this.rememberMe = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) return;

    Swal.fire({
      allowOutsideClick: false,
      text: 'por favor... espere un momento',
      icon: 'info'
    });
    Swal.showLoading();

    this.auth.login(this.user).subscribe(
      resp => {
        console.log('resp: ', resp);
        Swal.close();
        if (this.rememberMe) localStorage.setItem('username', this.user.username);
        console.log('navegar a home')
        this.router.navigateByUrl('/home');
      },
      err => {
        Swal.fire({
          allowOutsideClick: false,
          text: 'invalid credentials',
          icon: 'warning'
        });
      }
    );
  }


}
