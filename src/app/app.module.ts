import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CustomerComponent } from './customer/customer.component';
import { AppRoutingModule } from './app.routes';
import { CustomerService } from './customer/customer.service';
import { CustomerFormComponent } from './customer/customer-form.component';


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
