import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openedModal = false;
  private _uploadNotifier = new EventEmitter<any>();

  constructor() { }

  get uploadNotifier(): EventEmitter<any>{
    return this._uploadNotifier;
  }

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
