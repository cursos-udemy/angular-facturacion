import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Customer } from '../models/customer';
import { Region } from '../models/region';
import { AuthService } from '../security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private urlEndpoint: string = 'http://localhost:8080/api/v1/customers';

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  public getCustomers(page: number = 0, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.urlEndpoint}?page=${page}&limit=${limit}`)
      .pipe(
        catchError(e => {
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        }));
  }

  public getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.urlEndpoint}/${id}`)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          if (this.isNotAuthorized(e)) return throwError(e);

          this.router.navigate(['/customers']);
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        }));
  }

  public create(customer: Customer): Observable<Customer> {
    return this.http.post(this.urlEndpoint, customer)
      .pipe(
        map((resp: any) => resp.customer as Customer),
        catchError(e => {
          if (this.isNotAuthorized(e)) return throwError(e);
          if (e.status == 400) return throwError(e);
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        })
      );
  }

  public update(customer: Customer): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/${customer.id}`, customer)
      .pipe(
        catchError(e => {
          if (this.isNotAuthorized(e)) return throwError(e);
          if (e.status == 400) return throwError(e);
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        }));
  }

  public delete(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.urlEndpoint}/${id}`)
      .pipe(catchError(e => {
        if (this.isNotAuthorized(e)) return throwError(e);
        this.router.navigate(['/customers']);
        Swal.fire('', e.error.message, 'error');
        return throwError(e);
      }));
  }

  public upload(file: File, customerId: number): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('id', customerId.toString());
    formData.append('image', file);

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {reportProgress: true });
    return this.http.request(req).pipe(
      catchError(e => {
        if (this.isNotAuthorized(e)) return throwError(e);
        Swal.fire('', e.error.message, 'error');
        return throwError(e);
      }));
    ;
  }

  public getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndpoint}/regions`)
      .pipe(
        catchError(e => {
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        }));
  }

  private isNotAuthorized(err): boolean {
    if (err['status'] == 401) {
      if (this.auth.isAuthenticated()) {
        this.auth.logout();
      }
      this.router.navigateByUrl("/login");
      return true;
    }
    if (err['status'] == 403) {
      Swal.fire('', 'No tienes permisos para ejecutar esta acción', 'warning');
      this.router.navigateByUrl("/customers");
      return true;
    }
    return false;
  }
}
