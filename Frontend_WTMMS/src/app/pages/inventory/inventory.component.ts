import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import * as QRCode from 'qrcode';
import { InventoryItem } from '../../models/models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
  readonly data = inject(DataService);
  private toast = inject(ToastService);
  private modal = inject(ModalService);
  private auth = inject(AuthService);

  search = signal('');
  showModal = signal(false);
  showQrModal = signal(false);
  qrItem = signal<InventoryItem | null>(null);
  editingItem = signal<InventoryItem | null>(null);

  canEdit = computed(() => {
    const role = this.auth.userRole();
    return role === 'Admin' || role === 'BusinessOwner' || role === 'InventoryManager';
  });

  form: Partial<InventoryItem> = {};
  formErrors: Record<string, string> = {};

  readonly grades = ['Grade A+', 'Grade A', 'Grade B', 'Grade C'];

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.data.inventory().filter(i => i.type.toLowerCase().includes(q));
  });

  get alerts() { return this.data.inventory().filter(i => i.status !== 'In Stock'); }

  ngOnInit() {
    this.data.loadInventory();
  }

  onSearch(val: string) { this.search.set(val); }

  openAdd() {
    this.editingItem.set(null);
    this.form = { unit: 'm³', grade: 'Grade A' };
    this.formErrors = {};
    this.showModal.set(true);
  }

  openEdit(item: InventoryItem) {
    this.editingItem.set(item);
    this.form = { ...item };
    this.formErrors = {};
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  refresh() { 
    this.search.set('');
    this.data.loadInventory();
    this.toast.show('Inventory refreshed', 'info'); 
  }

  validate(): boolean {
    this.formErrors = {};
    if (!this.form.type?.trim()) this.formErrors['type'] = 'Type is required';
    if (!this.form.grade) this.formErrors['grade'] = 'Grade is required';
    if (this.form.qty == null || this.form.qty < 0) this.formErrors['qty'] = 'Valid quantity required';
    if (!this.form.price || this.form.price <= 0) this.formErrors['price'] = 'Valid price required';
    if (!this.form.location?.trim()) this.formErrors['location'] = 'Location is required';
    if (this.form.reorder == null || this.form.reorder < 0) this.formErrors['reorder'] = 'Valid reorder point required';
    return Object.keys(this.formErrors).length === 0;
  }

  qrCodeDataUrl = signal<string>('');

  save() {
    if (!this.validate()) return;
    const editing = this.editingItem();
    if (editing) {
      this.data.updateInventoryItem({ ...editing, ...this.form } as InventoryItem).subscribe({
        next: () => {
          this.toast.show('Item updated successfully');
          this.showModal.set(false);
        },
        error: (err) => this.toast.show('Failed to update item', 'error')
      });
    } else {
      this.data.addInventoryItem(this.form as Omit<InventoryItem, 'id' | 'status'>).subscribe({
        next: (newItem) => {
          this.toast.show('Item added successfully');
          this.showModal.set(false);
          // Automatically open QR code for newly added item
          this.openQr(newItem);
        },
        error: (err) => this.toast.show('Failed to add item', 'error')
      });
    }
  }

  async openQr(item: InventoryItem) {
    this.qrItem.set(item);
    try {
      const payload = JSON.stringify({
        id: item.id,
        type: item.type,
        location: item.location
      });
      const dataUrl = await QRCode.toDataURL(payload, { width: 300, margin: 2, color: { dark: '#5C2E0E', light: '#ffffff' } });
      this.qrCodeDataUrl.set(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code', err);
      this.toast.show('Failed to generate QR code', 'error');
    }
    this.showQrModal.set(true);
  }

  closeQr() { 
    this.showQrModal.set(false); 
    this.qrCodeDataUrl.set('');
  }

  confirmDelete(item: InventoryItem) {
    this.modal.confirm(
      'Delete Item',
      `Are you sure you want to delete "${item.type}" (${item.id})?`,
      () => {
        this.data.deleteInventoryItem(item.id).subscribe({
          next: () => this.toast.show('Item deleted', 'error'),
          error: (err) => this.toast.show('Failed to delete item', 'error')
        });
      }
    );
  }

  stockBarColor(qty: number, reorder: number): string {
    if (qty <= reorder * 0.5) return '#ef4444';
    if (qty <= reorder) return '#fbbf24';
    return 'var(--accent)';
  }

  stockBarWidth(qty: number, reorder: number): number {
    const max = Math.max(qty, reorder) * 1.5;
    return Math.min((qty / max) * 100, 100);
  }

  statusBadge(status: string): { bg: string; color: string } {
    if (status === 'In Stock') return { bg: '#dcfce7', color: '#166534' };
    if (status === 'Low Stock') return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#fee2e2', color: '#991b1b' };
  }
}
