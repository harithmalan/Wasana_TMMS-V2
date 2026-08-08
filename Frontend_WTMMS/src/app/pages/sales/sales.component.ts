import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/models';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
})
export class SalesComponent implements OnInit {
  readonly data = inject(DataService);
  readonly toast = inject(ToastService);
  private modal = inject(ModalService);
  private auth = inject(AuthService);

  search = signal('');
  showOrderModal = signal(false);
  showViewModal = signal(false);
  viewingOrder = signal<Order | null>(null);
  editingOrder = signal<Order | null>(null);

  canEdit = computed(() => {
    const role = this.auth.userRole();
    return role === 'Admin' || role === 'BusinessOwner' || role === 'SalesManager';
  });

  form: Partial<Order> = {};
  formErrors: Record<string, string> = {};

  readonly orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  readonly paymentStatuses = ['Unpaid', 'Partial', 'Paid'];

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.data.orders().filter(o =>
      o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
    );
  });

  get summaryCards() {
    const orders = this.data.orders();
    const totalRev = orders.reduce((a, o) => a + o.amount, 0);
    const pending = orders.filter(o => o.payment !== 'Paid').reduce((a, o) => a + o.amount, 0);
    const avg = orders.length ? Math.round(totalRev / orders.length) : 0;
    return [
      { label: 'Orders This Month', value: String(orders.length), sub: '+12% vs last month' },
      { label: 'Revenue', value: `Rs. ${totalRev.toLocaleString()}`, sub: 'July 2026' },
      { label: 'Pending Payment', value: `Rs. ${pending.toLocaleString()}`, sub: `${orders.filter(o => o.payment !== 'Paid').length} orders` },
      { label: 'Avg Order Value', value: `Rs. ${avg.toLocaleString()}`, sub: 'per order' },
    ];
  }

  ngOnInit() {
    this.data.loadOrders();
  }

  onSearch(val: string) { this.search.set(val); }

  openNewOrder() {
    this.editingOrder.set(null);
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    this.form = { status: 'Pending', payment: 'Unpaid', date: dateStr };
    this.formErrors = {};
    this.showOrderModal.set(true);
  }

  openView(o: Order) {
    this.viewingOrder.set(o);
    this.showViewModal.set(true);
  }

  closeOrderModal() { this.showOrderModal.set(false); }
  closeViewModal() { this.showViewModal.set(false); }

  validate(): boolean {
    this.formErrors = {};
    if (!this.form.customer?.trim()) this.formErrors['customer'] = 'Customer is required';
    if (!this.form.items?.trim()) this.formErrors['items'] = 'Items are required';
    if (!this.form.amount || this.form.amount <= 0) this.formErrors['amount'] = 'Valid amount required';
    return Object.keys(this.formErrors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    this.data.addOrder(this.form as Omit<Order, 'id'>).subscribe({
      next: () => {
        this.toast.show('Order created successfully');
        this.showOrderModal.set(false);
      },
      error: (err) => this.toast.show('Failed to create order', 'error')
    });
  }

  exportSalesCsv() {
    const orders = this.filtered();
    if (!orders.length) {
      this.toast.show('No orders to export', 'info');
      return;
    }
    const headers = ['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status', 'Payment'];
    const csvRows = [headers.join(',')];

    for (const o of orders) {
      // Escape items that might contain commas
      const itemsStr = o.items.includes(',') ? `"${o.items}"` : o.items;
      csvRows.push(`${o.id},${o.customer},${itemsStr},${o.amount},${o.date},${o.status},${o.payment}`);
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.show('Sales data exported', 'success');
  }

  printInvoice(o: Order) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.toast.show('Please allow popups to print invoices', 'error');
      return;
    }

    const html = `
      <html>
        <head>
          <title>Invoice - ${o.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #5C2E0E; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #5C2E0E; font-size: 28px; }
            .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
            .details div { line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f9f9f9; color: #5C2E0E; }
            .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 50px; text-align: center; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Wasana Timber (Pvt) Ltd</h1>
            <p>123 Main Road, Colombo, Sri Lanka<br>Phone: +94 11 234 5678 | Email: info@wasanatimber.lk</p>
          </div>
          <div class="details">
            <div>
              <strong>Invoice To:</strong><br>
              ${o.customer}
            </div>
            <div style="text-align: right;">
              <strong>Invoice No:</strong> ${o.id}<br>
              <strong>Date:</strong> ${o.date}<br>
              <strong>Payment Status:</strong> ${o.payment}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${o.items}</td>
                <td style="text-align: right;">Rs. ${o.amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Amount: Rs. ${o.amount.toLocaleString()}
          </div>
          <div class="footer">
            Thank you for your business!
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  }

  statusBadge(status: string): { bg: string; color: string } {
    const m: Record<string, { bg: string; color: string }> = {
      Delivered: { bg: '#dcfce7', color: '#166534' },
      Processing: { bg: '#dbeafe', color: '#1e40af' },
      Shipped: { bg: 'var(--secondary)', color: 'var(--secondary-foreground)' },
      Pending: { bg: '#fef3c7', color: '#92400e' },
    };
    return m[status] ?? m['Pending'];
  }

  payBadge(payment: string): { bg: string; color: string } {
    const m: Record<string, { bg: string; color: string }> = {
      Paid: { bg: '#dcfce7', color: '#166534' },
      Partial: { bg: '#fef3c7', color: '#92400e' },
      Unpaid: { bg: '#fee2e2', color: '#991b1b' },
    };
    return m[payment] ?? m['Unpaid'];
  }
}
