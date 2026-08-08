import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  readonly data = inject(DataService);
  private toast = inject(ToastService);
  private modal = inject(ModalService);

  search = signal('');
  showModal = signal(false);
  editingUser = signal<User | null>(null);

  form: Partial<User> & { password?: string } = {};
  formErrors: Record<string, string> = {};

  readonly roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'BusinessOwner', label: 'Business Owner' },
    { value: 'InventoryManager', label: 'Inventory Manager' },
    { value: 'SalesManager', label: 'Sales Manager' },
  ];
  readonly statuses = ['Active', 'Inactive'];

  roleLabel(role: string): string {
    return this.roles.find(r => r.value === role)?.label ?? role;
  }

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.data.users().filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.data.loadUsers();
  }

  onSearch(val: string) { this.search.set(val); }

  openAdd() {
    this.editingUser.set(null);
    this.form = { role: this.roles[0].value, status: 'Active' };
    this.formErrors = {};
    this.showModal.set(true);
  }

  openEdit(u: User) {
    this.editingUser.set(u);
    this.form = { ...u };
    this.formErrors = {};
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  validate(): boolean {
    this.formErrors = {};
    if (!this.form.name?.trim()) this.formErrors['name'] = 'Name is required';
    if (!this.form.email?.trim()) this.formErrors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.formErrors['email'] = 'Invalid email';
    if (!this.form.role) this.formErrors['role'] = 'Role is required';
    if (!this.form.status) this.formErrors['status'] = 'Status is required';
    if (!this.editingUser()) {
      if (!this.form.password || this.form.password.length < 6) this.formErrors['password'] = 'Min 6 characters';
    }
    return Object.keys(this.formErrors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    const editing = this.editingUser();
    if (editing) {
      this.data.updateUser({ ...editing, ...this.form } as User).subscribe({
        next: () => {
          this.toast.show('User updated successfully');
          this.showModal.set(false);
        },
        error: (err) => this.toast.show(err.error?.message ?? 'Failed to update user', 'error')
      });
    } else {
      this.data.addUser(this.form as Omit<User, 'id' | 'lastLogin' | 'avatar'> & { password: string }).subscribe({
        next: () => {
          this.toast.show('User added successfully');
          this.showModal.set(false);
        },
        error: (err) => this.toast.show(err.error?.message ?? 'Failed to add user', 'error')
      });
    }
  }

  confirmDelete(u: User) {
    this.modal.confirm(
      'Delete User',
      `Are you sure you want to delete "${u.name}"? This action cannot be undone.`,
      () => {
        this.data.deleteUser(u.id).subscribe({
          next: () => this.toast.show('User deleted', 'error'),
          error: (err) => this.toast.show('Failed to delete user', 'error')
        });
      }
    );
  }

  getRoleBg(role: string): string {
    const m: Record<string, string> = { Admin: '#fee2e2', BusinessOwner: '#dbeafe', InventoryManager: 'var(--secondary)', SalesManager: '#dcfce7' };
    return m[role] ?? 'var(--secondary)';
  }
  getRoleColor(role: string): string {
    const m: Record<string, string> = { Admin: '#991b1b', BusinessOwner: '#1e40af', InventoryManager: 'var(--secondary-foreground)', SalesManager: '#166534' };
    return m[role] ?? 'var(--secondary-foreground)';
  }
  statusBg(s: string) { return s === 'Active' ? '#ecfdf5' : '#f3f4f6'; }
  statusColor(s: string) { return s === 'Active' ? '#047857' : '#6b7280'; }
}
