import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openedModal  = false;

  constructor() { }

  public openModal() {
    this.openedModal = true;
  }

  public closeModal() {
    this.openedModal = false;
  }

  public isOpened(): boolean {
    return this.openedModal;
  }

}
