import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Customer } from '../models/customer';

import Swal from 'sweetalert2';
import { Region } from '../models/region';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private urlEndpoint: string = 'http://localhost:8080/api/v1/customers';
  private httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  private isNotAuthorized(err): boolean {
    if (err['status'] == 401 || err['status'] == 403) {
      this.router.navigateByUrl("/login");
      //this.router.navigate(["/login"]);
      return true;
    }
    return false;
  }

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
    console.log(customer);
    return this.http.post(this.urlEndpoint, customer, { headers: this.httpHeaders })
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
    return this.http.put<any>(`${this.urlEndpoint}/${customer.id}`, customer, { headers: this.httpHeaders })
      .pipe(
        catchError(e => {
          if (this.isNotAuthorized(e)) return throwError(e);
          if (e.status == 400) return throwError(e);
          Swal.fire('', e.error.message, 'error');
          return throwError(e);
        }));
  }

  public delete(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.urlEndpoint}/${id}`, { headers: this.httpHeaders })
      .pipe(catchError(e => {
        if (this.isNotAuthorized(e)) return throwError(e);
        this.router.navigate(['/customers']);
        Swal.fire('', e.error.message, 'error');
        return throwError(e);
      }));
  }

  public upload(file: File, customerId: number): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("image", file);
    formData.append("id", customerId.toString());

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, { reportProgress: true });
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

}
