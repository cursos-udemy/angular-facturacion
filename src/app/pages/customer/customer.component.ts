import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { Customer } from './customer';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
})
export class CustomerComponent implements OnInit {

  public customers: Customer[];
  public page: number;
  private limit = 3;
  public paginator: any;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe(param => {
        const page: number = +param.get("page");
        this.customerService.getCustomers(page, this.limit).subscribe(
          customers => {
            this.paginator = customers;
            this.customers = customers.content
          }
        );
      });
  }

  public delete(customer: Customer) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: `¿Esta seguro de eliminar al cliente ${customer.name}?`,
      text: 'Ud. no podra revertir esta accion!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        console.log('Eliminando cliente ', customer.name);
        this.customerService.delete(customer.id).subscribe(
          _ => {
            this.customers = this.customers.filter(c => c.id != customer.id);

            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El cliente a sido eliminado.',
              'success'
            );
          }
        );

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El cliente aun esta disponible :)',
          'error'
        )
      }
    });
  }
}
