import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AiComponent } from './pages/ai/ai.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'ai', component: AiComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
