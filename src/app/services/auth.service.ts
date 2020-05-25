import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserInput } from '../pages/login/user.input';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private enpointSignIn = `http://localhost:8080/oauth/token`;
  private token: string;


  constructor(private http: HttpClient) {
    this.readToken();
  }

  public login(user: UserInput): Observable<any> {
    const clientId = 'angular-app';
    const clientSecret = '12345';
    const appCredentials = btoa(`${clientId}:${clientSecret}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${appCredentials}`
    });
    let authData = new URLSearchParams();
    authData.set('grant_type', 'password');
    authData.set('username', user.username);
    authData.set('password', user.password);
    return this.http.post<any>(this.enpointSignIn, authData.toString(), { headers })
      .pipe(map(resp => {
        this.writeToken(resp['access_token']);
        return resp;
      }));
  }

  public logout() {
    localStorage.removeItem('token')
  }

  public isAuthenticated(): boolean {
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
