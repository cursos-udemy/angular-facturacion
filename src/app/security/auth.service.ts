import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserInput } from '../pages/login/models/user.input';
import { UserModel } from '../pages/login/models/user.model';

const KEY_ITEM_TOKEN: string = "APP-TOKEN";
const KEY_ITEM_REFRESH_TOKEN: string = "APP-REFRESH-TOKEN";
const KEY_ITEM_USER: string = "APP-USER";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private enpointOauth = `http://localhost:8080/oauth/token`;
  private _token: string;
  private _refreshToken: string;
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

  public get refreshToken(): string {
    if (this._refreshToken != null) return this._refreshToken;
    if (sessionStorage.getItem(KEY_ITEM_REFRESH_TOKEN) != null) {
      this._refreshToken = sessionStorage.getItem(KEY_ITEM_REFRESH_TOKEN);
      return this._refreshToken;
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
    return this.http.post<string>(this.enpointOauth, authData.toString(), { headers })
      .pipe(map(resp => {
        this.storeInfoAuthentication(resp);
        return resp['user_name'];
      }));
  }

  public logout() {
    this._token = null;
    this._user = null;
    this._refreshToken = null;
    sessionStorage.clear();
  }

  public isAuthenticated(): boolean {
    if (!this.token) return false;
    return !this.isTokenExpired();
  }

  private isTokenExpired(): boolean {
    const { exp } = this.getPayload(this.token);
    if (!exp) return false;
    const time = (new Date()).getTime() / 1000;
    return exp < time;
  }

  public hasRoleAdmin(): boolean {
    return this.hasRole("ROLE_ADMIN");
  }

  public hasRoleUser(): boolean {
    return this.hasRole("ROLE_USER");
  }

  public hasRole(role: string): boolean {
    return this.user.roles.includes(role);
  }

  public refreshTokenRequest(token: string): Observable<any> {
    const credentials = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', token);
    return this.http.post<any>(this.enpointOauth, params.toString(), { headers: httpHeaders })
      .pipe(map(resp => {
        this.storeInfoAuthentication(resp);
        return resp['user_name'];
      }));
  }

  private storeInfoAuthentication(data: any): void {
    const { access_token, refresh_token } = data;
    if (access_token) {
      const payload = this.getPayload(access_token);
      this._token = access_token;
      this._refreshToken = refresh_token;
      this._user = this.getUser(payload);
      sessionStorage.setItem(KEY_ITEM_TOKEN, access_token);
      sessionStorage.setItem(KEY_ITEM_REFRESH_TOKEN, refresh_token);
      sessionStorage.setItem(KEY_ITEM_USER, JSON.stringify(this._user));
    }
  }

  private getUser(payload: any): UserModel {
    const user = new UserModel();
    user.id = payload.id
    user.username = payload.user_name;
    user.name = payload.first_name;
    user.lastname = payload.last_name;
    user.email = payload.email;
    user.roles = payload.authorities;
    return user;
  }

  private getPayload(token: string): any {
    return JSON.parse(atob(token.split(".")[1]));
  }
}
