import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customers/customer.component';
import { CustomerFormComponent } from './pages/customers/customer-form.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './security/auth.guard';
import { RoleGuard } from './security/role.guard';

const routes: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'customers', component: CustomerComponent },
    { path: 'customers/page/:page', component: CustomerComponent },
    { path: 'customers/form', component: CustomerFormComponent, canActivate: [RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'customers/form/:id', component: CustomerFormComponent, canActivate: [RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'invoice/:id', component: CustomerFormComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

