import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';

import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerFormComponent } from './pages/customer/customer-form.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { CustomerService } from './pages/customer/customer.service';


import { registerLocaleData } from '@angular/common';
import localeAR from '@angular/common/locales/es-AR';

registerLocaleData(localeAR, 'es-AR');


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CustomerComponent,
    CustomerFormComponent,
    PaginatorComponent,
    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [CustomerService, {provide: LOCALE_ID, useValue: 'es-AR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
