import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastComponent } from '../toast/toast.component';
import { ConfirmDialogComponent } from '../modal/confirm-dialog.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent, ConfirmDialogComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-topbar />
        <main class="flex-1 overflow-y-auto p-5">
          <router-outlet />
        </main>
      </div>
    </div>
    <app-toast />
    <app-confirm-dialog />
  `,
})
export class LayoutComponent implements OnInit {
  private data = inject(DataService);

  ngOnInit() {
    // Load notifications on app startup so badge shows correct unread count
    this.data.loadNotifications();
  }
}

