import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {

  public pageName: string

  constructor() { }

  ngOnInit(): void {
    this.pageName = "hola"
  }

}
