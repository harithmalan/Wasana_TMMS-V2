import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { Supplier } from '../../models/models';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.component.html',
})
export class SuppliersComponent implements OnInit {
  readonly data = inject(DataService);
  private toast = inject(ToastService);
  private modal = inject(ModalService);

  search = signal('');
  showModal = signal(false);
  editingSupplier = signal<Supplier | null>(null);

  form: Partial<Supplier> = {};
  formErrors: Record<string, string> = {};

  readonly statuses = ['Active', 'Inactive'];

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.data.suppliers().filter(s => s.name.toLowerCase().includes(q));
  });

  get summaryCards() {
    const list = this.data.suppliers();
    const active = list.filter(s => s.status === 'Active');
    const avgRating = active.length ? (active.reduce((a, s) => a + s.rating, 0) / active.length).toFixed(1) : '0';
    const avgOnTime = active.length ? Math.round(active.reduce((a, s) => a + s.onTime, 0) / active.length) : 0;
    return [
      { label: 'Avg Rating', value: `${avgRating} / 5` },
      { label: 'On-Time Delivery', value: `${avgOnTime}%` },
      { label: 'Active Suppliers', value: String(active.length) },
      { label: 'Pending Orders', value: '2' },
    ];
  }

  ngOnInit() {
    this.data.loadSuppliers();
  }

  onSearch(val: string) { this.search.set(val); }

  openAdd() {
    this.editingSupplier.set(null);
    this.form = { country: 'Sri Lanka', status: 'Active', rating: 4.0, onTime: 90 };
    this.formErrors = {};
    this.showModal.set(true);
  }

  openEdit(s: Supplier) {
    this.editingSupplier.set(s);
    this.form = { ...s };
    this.formErrors = {};
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  validate(): boolean {
    this.formErrors = {};
    if (!this.form.name?.trim()) this.formErrors['name'] = 'Name is required';
    if (!this.form.contact?.trim()) this.formErrors['contact'] = 'Contact is required';
    if (!this.form.email?.trim()) this.formErrors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.formErrors['email'] = 'Invalid email';
    if (!this.form.phone?.trim()) this.formErrors['phone'] = 'Phone is required';
    if (!this.form.materials?.trim()) this.formErrors['materials'] = 'Materials is required';
    return Object.keys(this.formErrors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    const today = new Date();
    // Use ISO string instead of DD/MM/YYYY since backend probably expects YYYY-MM-DD
    const dateStr = today.toISOString().split('T')[0];
    const editing = this.editingSupplier();
    if (editing) {
      this.data.updateSupplier({ ...editing, ...this.form } as Supplier).subscribe({
        next: () => {
          this.toast.show('Supplier updated successfully');
          this.showModal.set(false);
        },
        error: (err) => this.toast.show('Failed to update supplier', 'error')
      });
    } else {
      this.data.addSupplier({ ...this.form, lastOrder: dateStr } as Omit<Supplier, 'id'>).subscribe({
        next: () => {
          this.toast.show('Supplier added successfully');
          this.showModal.set(false);
        },
        error: (err) => this.toast.show('Failed to add supplier', 'error')
      });
    }
  }

  confirmDelete(s: Supplier) {
    this.modal.confirm(
      'Delete Supplier',
      `Are you sure you want to delete "${s.name}"?`,
      () => {
        this.data.deleteSupplier(s.id).subscribe({
          next: () => this.toast.show('Supplier deleted', 'error'),
          error: (err) => this.toast.show('Failed to delete supplier', 'error')
        });
      }
    );
  }

  statusBadge(status: string) {
    return status === 'Active' ? { bg: '#ecfdf5', color: '#047857' } : { bg: '#f3f4f6', color: '#6b7280' };
  }
}
