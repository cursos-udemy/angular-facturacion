import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerFormComponent } from './pages/customer/customer-form.component';
import { ProfileComponent } from './pages/profile/profile.component';


const routes: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'customers', component: CustomerComponent },
    { path: 'customers/page/:page', component: CustomerComponent },
    { path: 'customers/form', component: CustomerFormComponent },
    { path: 'customers/form/:id', component: CustomerFormComponent },
    { path: 'customers/profile/:id', component: ProfileComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

