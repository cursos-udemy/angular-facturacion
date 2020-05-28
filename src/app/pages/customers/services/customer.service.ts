import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { Region } from '../models/region';
import { Customer } from '../models/customer';
import { Invoice } from '../../invoices/models/invoice';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private endpoint: string = `${environment.backendServiceURL}/api/v1/customers`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getCustomers(page: number = 0, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.endpoint}?page=${page}&limit=${limit}`);
  }

  public getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.endpoint}/${id}`)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          if (e.status != 401) this.router.navigate(['/customers']);
          return throwError(e);
        }));
  }

  public create(customer: Customer): Observable<Customer> {
    return this.http.post(this.endpoint, customer)
      .pipe(
        map((resp: any) => resp.customer as Customer),
        catchError(e => {
          if (e.status == 400) return throwError(e);
          return throwError(e);
        })
      );
  }

  public update(customer: Customer): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/${customer.id}`, customer)
      .pipe(
        catchError(e => {
          if (e.status == 400) return throwError(e);
          return throwError(e);
        }));
  }

  public delete(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.endpoint}/${id}`)
      .pipe(catchError(e => {
        this.router.navigate(['/customers']);
        return throwError(e);
      }));
  }

  public upload(file: File, customerId: number): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('id', customerId.toString());
    formData.append('image', file);

    const req = new HttpRequest('POST', `${this.endpoint}/upload`, formData, { reportProgress: true });
    return this.http.request(req);
  }

  public getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.endpoint}/regions`);
  }

  public getInvoices(customerId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.endpoint}/${customerId}/invoices`);
  }
}
