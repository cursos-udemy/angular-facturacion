import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';
import { Item } from '../models/item';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private urlEndPoint: string = 'http://localhost:8080/api/v1/invoices';
  private urlEndpointProducts: string = 'http://localhost:8080/api/v1/products';

  constructor(private http: HttpClient) { }

  public findById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.urlEndPoint}/${id}`);
  }

  public create(invoice: Invoice): Observable<Invoice> {
    return this.http.post<any>(this.urlEndPoint, invoice)
    .pipe (
      map( resp => resp.invoice as Invoice)
    );
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  public filterProducts(term: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.urlEndpointProducts}/filter/${term}`);
  }
}
