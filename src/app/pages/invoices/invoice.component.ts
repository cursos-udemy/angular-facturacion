import { Component, OnInit } from '@angular/core';
import { Invoice } from './models/invoice';
import { InvoiceService } from './services/invoice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',})
export class InvoiceComponent implements OnInit {

  public invoice: Invoice;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      this.invoiceService.findById(id).subscribe(invoice => this.invoice = invoice);
    });
  }
}
