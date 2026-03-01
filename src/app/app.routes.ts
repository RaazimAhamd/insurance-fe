import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
// import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { PolicyListComponent } from './features/policies/policy-list/policy-list.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { CustomerManagementComponent } from './features/dashboard/customer-management/customer-management.component';
// import { CustomerManagementComponent } from './features/dashboard/customer-management/customer-management.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customer', component: CustomerManagementComponent },
      { path: 'policies', component: PolicyListComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];
