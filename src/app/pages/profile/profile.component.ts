import { Component, OnInit, Input } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

import Swal from 'sweetalert2';

import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { ModalService } from './modal.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private customerService: CustomerService,
    private modalService: ModalService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  selectImage(event) {
    this.imageSelected = event.target.files[0];
    this.progreso = 0;
    this.filenameSelected = this.imageSelected.name;
    if (this.imageSelected.type.indexOf('image') < 0) {
      Swal.fire('', 'El archivo debe ser del tipo imagen', 'error');
      this.imageSelected = null;
      this.filenameSelected = "Seleccione una imagen";
    }
  }

  uploadImage() {
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
    this.filenameSelected = "Seleccione una imagen"
  }

  public modalIsOpen(): boolean {
    return this.modalService.isOpened();
  }

}
