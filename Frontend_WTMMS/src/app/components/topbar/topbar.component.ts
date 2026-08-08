import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private router = inject(Router);
  private data = inject(DataService);
  readonly theme = inject(ThemeService);

  get title(): string {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/users': 'User Management',
      '/inventory': 'Inventory Management',
      '/customers': 'Customer Management',
      '/suppliers': 'Supplier Management',
      '/sales': 'Sales & Orders',
      '/reports': 'Reports & Analytics',
      '/ai': 'AI Forecasting',
      '/notifications': 'Notifications',
      '/profile': 'Profile Settings',
    };
    return titles[this.router.url] || 'Dashboard';
  }

  get unreadCount() { return this.data.unreadCount(); }

  navigate(route: string) { this.router.navigate([route]); }
}
