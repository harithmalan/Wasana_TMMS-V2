import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  readonly data = inject(DataService);
  readonly notifications = this.data.notifications;

  get unreadCount() { return this.data.unreadCount(); }

  ngOnInit() {
    this.data.loadNotifications();
  }

  markRead(id: number) { 
    this.data.markAsRead(id).subscribe(); 
  }
  
  markAllRead() { 
    this.data.markAllRead().subscribe(); 
  }

  iconConfig(type: string): { color: string; bg: string } {
    const map: Record<string, { color: string; bg: string }> = {
      critical: { color: '#ef4444', bg: '#fef2f2' },
      warning:  { color: '#f59e0b', bg: '#fffbeb' },
      success:  { color: '#16a34a', bg: '#f0fdf4' },
      info:     { color: '#3b82f6', bg: '#eff6ff' },
    };
    return map[type] || map['info'];
  }
}
