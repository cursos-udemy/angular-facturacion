import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

import Swal from 'sweetalert2';

import { CustomerService } from '../customers/services/customer.service';
import { ModalService } from './services/modal.service';
import { AuthService } from '../../security/auth.service';
import { Customer } from '../customers/models/customer';
import { Invoice } from '../invoices/models/invoice';
import { InvoiceService } from '../invoices/services/invoice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public title = "Profile";

  @Input()
  public customer: Customer;

  public progreso: number = 0;
  public imageSelected: File;
  public filenameSelected = "Seleccione una imagen";
  public invoices: Invoice[] = [];

  constructor(
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private modalService: ModalService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.findInvoices();
  }

  private findInvoices(): void {
    console.log('findInvoices', this.customer.id);
    this.invoices = [];
    this.customerService.getInvoices(this.customer.id).subscribe(
      invoices => this.invoices = invoices
    );
  }

  public selectImage(event) {
    this.imageSelected = event.target.files[0];
    this.progreso = 0;
    this.filenameSelected = this.imageSelected.name;
    if (this.imageSelected.type.indexOf('image') < 0) {
      Swal.fire('', 'El archivo debe ser del tipo imagen', 'error');
      this.imageSelected = null;
      this.filenameSelected = "Seleccione una imagen";
    }
  }

  public uploadImage() {
    if (!this.imageSelected) {
      Swal.fire('', 'Debe seleccionar una foto', 'error');
    } else {
      this.customerService.upload(this.imageSelected, this.customer.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.customer = response.customer as Customer;
            this.modalService.uploadNotifier.emit(this.customer);
            Swal.fire('La foto se ha subido!', response.message, 'success');
          }
        });
    }
  }

  public closeModal(): void {
    this.modalService.closeModal();
    this.imageSelected = null;
    this.progreso = 0;
    //this.invoices = [];
    this.filenameSelected = "Seleccione una imagen"
  }

  public modalIsOpen(): boolean {
    return this.modalService.isOpened();
  }


  public deleteInvoice(invoice: Invoice): void {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: `¿Esta seguro de eliminar la factura ${invoice.description}?`,
      text: 'Ud. no podra revertir esta accion!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.invoiceService.delete(invoice.id).subscribe(
          _ => {
            this.invoices = this.invoices.filter(i => i.id != invoice.id);
            swalWithBootstrapButtons.fire('Eliminado!', 'La factura a sido eliminado.', 'success');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire('Cancelado', 'La factura aun esta disponible :)', 'error');
      }
    });
  }
}
