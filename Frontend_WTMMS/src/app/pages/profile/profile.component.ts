import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { DataService } from '../../services/data.service';
import { UserProfile } from '../../models/models';

type Tab = 'details' | 'security' | 'prefs';

const ROLE_LABELS: Record<string, string> = {
  Admin: 'Admin',
  BusinessOwner: 'Business Owner',
  InventoryManager: 'Inventory Manager',
  SalesManager: 'Sales Manager',
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private toast = inject(ToastService);
  private data = inject(DataService);

  activeTab = signal<Tab>('details');

  tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'details', label: 'Personal Details', icon: 'users' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'prefs', label: 'Preferences', icon: 'sliders' },
  ];

  memberSince = '';

  // Details form
  details = { fullName: '', email: '', phone: '', department: '', role: '', avatar: '' };
  detailErrors: Record<string, string> = {};

  // Security form
  security = { current: '', newPass: '', confirm: '' };
  securityErrors: Record<string, string> = {};
  twoFaEnabled = signal(false);

  // Preferences
  prefs = { language: '', timezone: '', dateFormat: '', currency: '' };
  prefToggles = signal([
    { key: 'emailNotifications', label: 'Email notifications', enabled: true },
    { key: 'lowStockAlerts', label: 'Low stock alerts', enabled: true },
    { key: 'weeklyReports', label: 'Weekly reports', enabled: true },
    { key: 'aiForecastUpdates', label: 'AI forecast updates', enabled: true },
  ]);

  ngOnInit() {
    this.data.loadProfile().subscribe({
      next: (p) => this.applyProfile(p),
      error: () => this.toast.show('Failed to load profile', 'error')
    });
  }

  private applyProfile(p: UserProfile) {
    this.details = {
      fullName: p.name, email: p.email, phone: p.phone ?? '',
      department: p.department ?? '', role: this.roleLabel(p.role), avatar: p.avatar,
    };
    this.twoFaEnabled.set(p.twoFaEnabled);
    this.prefs = {
      language: p.language, timezone: p.timezone,
      dateFormat: p.dateFormat, currency: p.currency,
    };
    this.prefToggles.update(list => list.map(t => ({
      ...t,
      enabled: (p as any)[t.key] ?? t.enabled,
    })));
    this.memberSince = p.createdAt
      ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
  }

  roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? role;
  }

  setTab(tab: Tab) { this.activeTab.set(tab); }

  saveDetails() {
    this.detailErrors = {};
    if (!this.details.fullName.trim()) this.detailErrors['fullName'] = 'Name is required';
    if (!this.details.email.trim()) this.detailErrors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.details.email)) this.detailErrors['email'] = 'Invalid email';
    if (Object.keys(this.detailErrors).length > 0) return;

    this.data.updateProfileDetails({
      name: this.details.fullName,
      email: this.details.email,
      phone: this.details.phone,
      department: this.details.department,
    }).subscribe({
      next: (p) => {
        this.applyProfile(p);
        this.toast.show('Profile details saved successfully');
      },
      error: (err) => this.toast.show(err.error?.message ?? 'Failed to save profile', 'error')
    });
  }

  cancelDetails() {
    this.data.loadProfile().subscribe(p => this.applyProfile(p));
    this.detailErrors = {};
  }

  updatePassword() {
    this.securityErrors = {};
    if (!this.security.current) this.securityErrors['current'] = 'Current password is required';
    if (!this.security.newPass || this.security.newPass.length < 6) this.securityErrors['newPass'] = 'Min 6 characters';
    if (this.security.newPass !== this.security.confirm) this.securityErrors['confirm'] = 'Passwords do not match';
    if (Object.keys(this.securityErrors).length > 0) return;

    this.data.changePassword({
      currentPassword: this.security.current,
      newPassword: this.security.newPass,
      confirmPassword: this.security.confirm,
    }).subscribe({
      next: () => {
        this.security = { current: '', newPass: '', confirm: '' };
        this.toast.show('Password updated successfully');
      },
      error: (err) => {
        const message = err.error?.message;
        if (typeof message === 'string') this.securityErrors['current'] = message;
        this.toast.show(typeof message === 'string' ? message : 'Failed to update password', 'error');
      }
    });
  }

  toggleTwoFa() {
    this.data.toggleTwoFa().subscribe({
      next: (p) => {
        this.twoFaEnabled.set(p.twoFaEnabled);
        this.toast.show(p.twoFaEnabled ? '2FA enabled' : '2FA disabled', 'info');
      },
      error: () => this.toast.show('Failed to update 2FA', 'error')
    });
  }

  savePrefs() {
    const toggles = this.prefToggles();
    const byKey = (key: string) => toggles.find(t => t.key === key)?.enabled ?? false;

    this.data.updatePreferences({
      emailNotifications: byKey('emailNotifications'),
      lowStockAlerts: byKey('lowStockAlerts'),
      weeklyReports: byKey('weeklyReports'),
      aiForecastUpdates: byKey('aiForecastUpdates'),
      language: this.prefs.language,
      timezone: this.prefs.timezone,
      dateFormat: this.prefs.dateFormat,
      currency: this.prefs.currency,
    }).subscribe({
      next: (p) => {
        this.applyProfile(p);
        this.toast.show('Preferences saved successfully');
      },
      error: () => this.toast.show('Failed to save preferences', 'error')
    });
  }

  togglePref(index: number) {
    this.prefToggles.update(list => list.map((p, i) => i === index ? { ...p, enabled: !p.enabled } : p));
  }
}
