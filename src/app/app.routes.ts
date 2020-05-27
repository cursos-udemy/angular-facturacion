import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customers/customer.component';
import { CustomerFormComponent } from './pages/customers/customer-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RoleGuard } from './security/role.guard';
import { InvoiceComponent } from './pages/invoices/invoice.component';

const routes: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'customers', component: CustomerComponent },
    { path: 'customers/page/:page', component: CustomerComponent },
    { path: 'customers/form', component: CustomerFormComponent, canActivate: [RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'customers/form/:id', component: CustomerFormComponent, canActivate: [RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'invoices/:id', component: InvoiceComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

