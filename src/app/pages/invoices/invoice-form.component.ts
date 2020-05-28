import { Component, OnInit } from '@angular/core';
import { Invoice } from './models/invoice';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Item } from './models/item';
import { CustomerService } from '../customers/services/customer.service';
import { InvoiceService } from './services/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { InvoiceItem } from './models/invoice-item';

import Swal from 'sweetalert2';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {

  public title: string = 'Nueva Factura';
  public invoice: Invoice = new Invoice();

  public autocompleteControl = new FormControl();
  public itemsFiltered: Observable<Item[]>;

  constructor(
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('id');
      this.customerService.getCustomer(clienteId).subscribe(customer => this.invoice.customer = customer);
    });

    this.itemsFiltered = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.name),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Item[]> {
    const filterValue = value.toLowerCase();
    return this.invoiceService.filterProducts(filterValue);
  }

  public viewProductName(item?: Item): string | undefined {
    return item ? item.name : undefined;
  }

  public selectProduct(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Item;

    if (this.existItem(producto.id)) {
      this.increaseQuantity(producto.id);
    } else {
      let nuevoItem = new InvoiceItem();
      nuevoItem.item = producto;
      this.invoice.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }


  public updateQuantity(id: number, event: any): void {
    let quantity: number = event.target.value as number;
    if (quantity == 0) return this.deleteInvoiceItem(id);

    this.invoice.items = this.invoice.items.map((item: InvoiceItem) => {
      if (id === item.item.id) {
        item.quantity = quantity;
      }
      return item;
    });
  }

  public existItem(id: number): boolean {
    let exist = false;
    this.invoice.items.forEach((item: InvoiceItem) => {
      if (id === item.item.id) {
        exist = true;
      }
    });
    return exist;
  }

  public increaseQuantity(id: number): void {
    this.invoice.items = this.invoice.items.map((item: InvoiceItem) => {
      if (id === item.item.id) {
        ++item.quantity;
      }
      return item;
    });
  }

  public deleteInvoiceItem(id: number): void {
    this.invoice.items = this.invoice.items.filter((item: InvoiceItem) => id !== item.item.id);
  }

  public create(facturaForm): void {
    if (this.invoice.items.length == 0) {
      this.autocompleteControl.setErrors({ 'invalid': true });
    }

    if (facturaForm.form.valid && this.invoice.items.length > 0) {
      this.invoiceService.create(this.invoice).subscribe( invoice => {
        Swal.fire(this.title, `Invoice ${invoice.description} creada con éxito!`, 'success');
        this.router.navigate(['/invoices', invoice.id]);
      });
    }
  }

}
