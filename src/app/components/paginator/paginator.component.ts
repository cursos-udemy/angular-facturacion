import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styles: [
  ]
})
export class PaginatorComponent implements OnInit {

  @Input()
  public paginator: any;

  public pages: number[];

  public since: number;
  public until: number;
  private maxElementPaging = 5;

  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    let paginatorUpdated = changes['paginator'];
    if (paginatorUpdated.previousValue) {
      this.initPaginator();
    }
    
  }

  initPaginator(): void {
    const { totalPages } = this.paginator;
    this.since = Math.min(Math.max(0, this.paginator.number - this.maxElementPaging - 2), totalPages - this.maxElementPaging);
    this.until = Math.max(Math.min(totalPages, this.paginator.number + this.maxElementPaging - 1), this.maxElementPaging + 1);
    if (totalPages <= this.maxElementPaging) {
      this.pages = Array(totalPages).fill(0).map((_, i) => i);
    } else {
      this.pages = Array(this.until - this.since).fill(0).map((_, i) => this.since + i);
    }
  }

}
