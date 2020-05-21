import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer/customer-form.component';


const routes: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'customers', component: CustomerComponent },
    { path: 'customers/form', component: CustomerFormComponent },
    { path: 'customers/form/:id', component: CustomerFormComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

