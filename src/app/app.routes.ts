import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerFormComponent } from './pages/customer/customer-form.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'customers', component: CustomerComponent },
    { path: 'customers/page/:page', component: CustomerComponent },
    { path: 'customers/form', component: CustomerFormComponent },
    { path: 'customers/form/:id', component: CustomerFormComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

