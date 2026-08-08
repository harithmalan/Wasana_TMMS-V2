import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private data = inject(DataService);
  private router = inject(Router);
  private auth = inject(AuthService);

  collapsed = signal(false);

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory', route: '/inventory' },
    { id: 'customers', label: 'Customers', icon: 'customers', route: '/customers' },
    { id: 'suppliers', label: 'Suppliers', icon: 'suppliers', route: '/suppliers' },
    { id: 'sales', label: 'Sales & Orders', icon: 'sales', route: '/sales' },
    { id: 'reports', label: 'Reports', icon: 'reports', route: '/reports' },
    { id: 'ai', label: 'AI Forecasting', icon: 'ai', route: '/ai' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', route: '/notifications' },
    { id: 'users', label: 'User Management', icon: 'users', route: '/users' },
    { id: 'profile', label: 'Profile Settings', icon: 'profile', route: '/profile' },
  ];

  get unreadCount() { return this.data.unreadCount(); }

  toggleCollapse() { this.collapsed.update(c => !c); }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
