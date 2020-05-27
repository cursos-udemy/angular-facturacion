import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private urlEndPoint: string = 'http://localhost:8080/api/v1/invoices';

  constructor(private http: HttpClient) { }

  public findById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.urlEndPoint}/${id}`);
  }

  public create(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.urlEndPoint, invoice);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  public filterItems(term: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.urlEndPoint}/filter-items/${term}`);
  }
}
