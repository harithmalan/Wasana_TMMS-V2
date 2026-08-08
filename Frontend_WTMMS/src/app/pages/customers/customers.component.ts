import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { Customer } from '../../models/models';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  readonly data = inject(DataService);
  private toast = inject(ToastService);
  private modal = inject(ModalService);

  search = signal('');
  showModal = signal(false);
  editingCustomer = signal<Customer | null>(null);

  form: Partial<Customer> = {};
  formErrors: Record<string, string> = {};

  readonly segments = ['Premium', 'Regular', 'New'];
  readonly ratingOptions = [1, 2, 3, 4, 5];

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.data.customers().filter(c =>
      c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.data.loadCustomers();
  }

  onSearch(val: string) { this.search.set(val); }

  openAdd() {
    this.editingCustomer.set(null);
    this.form = { segment: 'Regular', rating: 3 };
    this.formErrors = {};
    this.showModal.set(true);
  }

  openEdit(c: Customer) {
    this.editingCustomer.set(c);
    this.form = { ...c };
    this.formErrors = {};
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  validate(): boolean {
    this.formErrors = {};
    if (!this.form.name?.trim()) this.formErrors['name'] = 'Name is required';
    if (!this.form.email?.trim()) this.formErrors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.formErrors['email'] = 'Invalid email';
    if (!this.form.phone?.trim()) this.formErrors['phone'] = 'Phone is required';
    if (!this.form.city?.trim()) this.formErrors['city'] = 'City is required';
    return Object.keys(this.formErrors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    const editing = this.editingCustomer();
    if (editing) {
      this.data.updateCustomer({ ...editing, ...this.form, contact: this.form.name! } as Customer).subscribe({
        next: () => {
          this.toast.show('Customer updated successfully');
          this.showModal.set(false);
        },
        error: (err) => this.toast.show('Failed to update customer', 'error')
      });
    } else {
      this.data.addCustomer({ ...this.form, contact: this.form.name! } as Omit<Customer, 'id' | 'segment'>).subscribe({
        next: () => {
          this.toast.show('Customer added successfully');
          this.showModal.set(false);
        },
        error: (err) => this.toast.show('Failed to add customer', 'error')
      });
    }
  }

  confirmDelete(c: Customer) {
    this.modal.confirm(
      'Delete Customer',
      `Are you sure you want to delete "${c.name}"?`,
      () => { 
        this.data.deleteCustomer(c.id).subscribe({
          next: () => this.toast.show('Customer deleted', 'error'),
          error: (err) => this.toast.show('Failed to delete customer', 'error')
        });
      }
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  segmentBadge(segment: string): { bg: string; color: string; border: string } {
    if (segment === 'Premium') return { bg: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
    if (segment === 'New') return { bg: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
    return { bg: 'var(--secondary)', color: 'var(--secondary-foreground)', border: 'none' };
  }

  stars(rating: number): boolean[] {
    return [1, 2, 3, 4, 5].map(i => i <= rating);
  }
}
