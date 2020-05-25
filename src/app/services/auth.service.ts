import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserInput } from '../pages/login/user.input';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiKey = 'AIzaSyBnhZOeNRD1UnIyr4gmvre6I7PLe0ryBZo';
  private baseURL = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private enpointSignIn = `${this.baseURL}:signInWithPassword?key=${this.apiKey}`;

  private token: string;


  constructor(private http: HttpClient) {
    this.readToken();
  }

  login(user: UserInput) {
    const authData = {
      username: user.username,
      password: user.password,
      returnSecureToken: true
    };
    return this.http.post(this.enpointSignIn, authData)
      .pipe(map(resp => {
        this.writeToken(resp['idToken']);
        return resp;
      }));
  }

  logout() {
    localStorage.removeItem('token')
  }

  isAuthenticated(): boolean {
    if (!this.token) return false;
    let expireIn = localStorage.getItem('expireIn');
    if (!expireIn) return false;
    return (Date.now() <= parseInt(expireIn));
  }

  private writeToken(userToken: string): void {
    this.token = userToken;
    localStorage.setItem('token', this.token);
    localStorage.setItem('expireIn', (Date.now() + 3600).toString());
  }

  private readToken(): string {
    this.token = localStorage.getItem('token');
    if (!this.token) this.token = '';
    return this.token;
  }

}
