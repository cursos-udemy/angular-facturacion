import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2'
import { Customer } from '../../models/customer';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customers-form',
  templateUrl: './customer-form.component.html',
  styles: []
})
export class CustomerFormComponent implements OnInit {

  public customer: Customer = new Customer();
  public title: string = "Alta Cliente";
  public errores: string[];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loadCustomer();
  }

  public loadCustomer() {
    this.activatedRoute.params
      .subscribe(params => {
        let id = params['id'];
        if (id) {
          this.customerService.getCustomer(id).subscribe(customer => this.customer = customer);
        }
      });
  }

  public create(): void {
    this.customerService.create(this.customer).subscribe(
      customer => {
        this.router.navigate(['/customers']);
        Swal.fire(
          'Good job!',
          `El cliente ${customer.name} fue creado con exito!`,
          'success'
        )
      }, err => {
        console.log(err.error.errors)
        this.errores = err.error.errors as string[]
      }
    );
  }

  public update(): void {
    this.customerService.update(this.customer).subscribe(
      resp => {
        this.router.navigate(['/customers']);
        Swal.fire(
          'Good job!',
          `El cliente "${resp.customer.name}" fue actualizado con exito!`,
          'success'
        )
      }, err => {
        console.log(err.error.errors)
        this.errores = err.error.errors as string[]
      }
    );
  }

}
