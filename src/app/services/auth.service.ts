import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserInput } from '../pages/login/user.input';
import { Observable } from 'rxjs';
import { UserModel } from '../pages/login/user.model';

const KEY_ITEM_TOKEN: string = "APP-TOKEN";
const KEY_ITEM_USER: string = "APP-USER";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private enpointSignIn = `http://localhost:8080/oauth/token`;
  private _token: string;
  private _user: UserModel;

  constructor(private http: HttpClient) { }

  public get user(): UserModel {
    if (this._user != null) return this._user;
    if (sessionStorage.getItem(KEY_ITEM_USER) != null) {
      this._user = JSON.parse(sessionStorage.getItem(KEY_ITEM_USER)) as UserModel
      return this._user
    }
    return new UserModel();
  }

  public get token(): string {
    if (this._token != null) return this._token;
    if (sessionStorage.getItem(KEY_ITEM_TOKEN) != null) {
      this._token = sessionStorage.getItem(KEY_ITEM_TOKEN);
      return this._token;
    }
    return null;
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
    return this.http.post<string>(this.enpointSignIn, authData.toString(), { headers })
      .pipe(map(resp => {
        this.storeInfoAuthentication(resp['access_token']);
        return resp['user_name'];
      }));
  }

  public logout() {
    sessionStorage.removeItem(KEY_ITEM_TOKEN)
  }

  public isAuthenticated(): boolean {
    if (!this.token) return false;
    const { exp } = this.getPayload(this.token);
    if (!exp) return false;
    const time = (new Date()).getTime();
    console.log("3", time, (exp*1000), (time<=exp*1000)) ;
    return ( time <= (exp*1000));
  }

  private storeInfoAuthentication(token: string): void {
    if (token) {
      const payload = this.getPayload(token);
      this._token = token;
      this._user = this.getUser(payload);
      sessionStorage.setItem(KEY_ITEM_TOKEN, token);
      sessionStorage.setItem(KEY_ITEM_USER, JSON.stringify(this._user));
    }
  }

  private getUser(payload: any): UserModel {
    const user = new UserModel();
    user.id = payload.id
    user.username = payload.user_name;
    user.name = payload.name;
    user.lastname = payload.lastname;
    user.email = payload.email;
    user.roles = payload.authorities;
    return user;
  }

  private getPayload(token: string): any {
    return JSON.parse(atob(token.split(".")[1]));
  }
}
