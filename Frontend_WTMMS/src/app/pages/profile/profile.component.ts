import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

type Tab = 'details' | 'security' | 'prefs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private toast = inject(ToastService);

  activeTab = signal<Tab>('details');

  tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'details', label: 'Personal Details', icon: 'users' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'prefs', label: 'Preferences', icon: 'sliders' },
  ];

  // Details form
  details = {
    fullName: 'M.R. Premasiri',
    username: 'mr.premasiri',
    email: 'premasiri@wasana.lk',
    phone: '077 456 7890',
    department: 'Administration',
    role: 'System Administrator',
  };
  detailErrors: Record<string, string> = {};

  // Security form
  security = { current: '', newPass: '', confirm: '' };
  securityErrors: Record<string, string> = {};
  twoFaEnabled = signal(false);

  // Preferences
  prefs = {
    language: 'Sinhala / English (Sri Lanka)',
    timezone: 'Asia/Colombo (UTC+5:30)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'Sri Lankan Rupee (Rs./LKR)',
  };
  prefToggles = signal([
    { label: 'Email notifications', enabled: true },
    { label: 'Low stock alerts', enabled: true },
    { label: 'Weekly reports', enabled: true },
    { label: 'AI forecast updates', enabled: true },
  ]);

  setTab(tab: Tab) { this.activeTab.set(tab); }

  saveDetails() {
    this.detailErrors = {};
    if (!this.details.fullName.trim()) this.detailErrors['fullName'] = 'Name is required';
    if (!this.details.email.trim()) this.detailErrors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.details.email)) this.detailErrors['email'] = 'Invalid email';
    if (Object.keys(this.detailErrors).length > 0) return;
    this.toast.show('Profile details saved successfully');
  }

  cancelDetails() {
    this.details = {
      fullName: 'M.R. Premasiri', username: 'mr.premasiri',
      email: 'premasiri@wasana.lk', phone: '077 456 7890',
      department: 'Administration', role: 'System Administrator',
    };
    this.detailErrors = {};
  }

  updatePassword() {
    this.securityErrors = {};
    if (!this.security.current) this.securityErrors['current'] = 'Current password is required';
    if (!this.security.newPass || this.security.newPass.length < 6) this.securityErrors['newPass'] = 'Min 6 characters';
    if (this.security.newPass !== this.security.confirm) this.securityErrors['confirm'] = 'Passwords do not match';
    if (Object.keys(this.securityErrors).length > 0) return;
    this.security = { current: '', newPass: '', confirm: '' };
    this.toast.show('Password updated successfully');
  }

  toggleTwoFa() {
    this.twoFaEnabled.update(v => !v);
    this.toast.show(this.twoFaEnabled() ? '2FA enabled' : '2FA disabled', 'info');
  }

  savePrefs() { this.toast.show('Preferences saved successfully'); }

  togglePref(index: number) {
    this.prefToggles.update(list => list.map((p, i) => i === index ? { ...p, enabled: !p.enabled } : p));
  }
}
