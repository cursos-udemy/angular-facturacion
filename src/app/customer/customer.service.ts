import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Customer } from './customer';

import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private urlEndpoint: string = 'http://localhost:8080/api/v1/customers';
  private httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.urlEndpoint)
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
          this.router.navigate(['/customers']);
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        }));
  }

  public create(customer: Customer): Observable<Customer> {
    return this.http.post(this.urlEndpoint, customer, { headers: this.httpHeaders })
      .pipe(
        map((resp: any) => resp.customer as Customer),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        })
      );
  }

  public update(customer: Customer): Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/${customer.id}`, customer, { headers: this.httpHeaders })
      .pipe(
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        }));
  }

  public delete(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.urlEndpoint}/${id}`, { headers: this.httpHeaders })
      .pipe(catchError(e => {
        this.router.navigate(['/customers']);
        Swal.fire('', e.error.message, 'error');
        return throwError(e);
      }));
  }

}
