import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { ModalService } from '../profile/modal.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
})
export class CustomerComponent implements OnInit {

  public customers: Customer[];
  public customerSelected: Customer;
  public page: number;
  private limit = 3;
  public paginator: any;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    // nos subscribimos a los cambios en el numero de pagina en la url
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

    // nos subscribimos a los cambios de imagen en el profile
    this.modalService.uploadNotifier.subscribe(
      customer => {
        console.log('procesando actualizacion de imagen de usuario');
        this.customers = this.customers.map(c => {
          if (c.id == customer.id) c.image = customer.image;
          return c;
        });
      }
    );
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

  openModal(customer: Customer): void {
    this.customerSelected = customer;
    this.modalService.openModal();
  }
}
