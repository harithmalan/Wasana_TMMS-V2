import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly data = inject(DataService);

  @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  private charts: Chart[] = [];

  readonly activities = [
    { icon: 'cart', text: 'New order ORD001 placed by Nimal Perera — Rs. 35,000', time: '09:30 AM', color: '#16a34a' },
    { icon: 'package', text: 'Stock updated: Teak Wood +200 m³ from Ruhunu Wood Suppliers', time: '02:15 PM', color: '#2563eb' },
    { icon: 'users', text: 'New customer registered: Sahan Jayawardena, Matara', time: '04:45 PM', color: '#9333ea' },
    { icon: 'alert', text: 'Low stock alert triggered for Coconut Timber (CT-005)', time: '3h ago', color: '#d97706' },
    { icon: 'dollar', text: 'Payment of Rs. 56,000 received from Dilshan Wijesinghe', time: '5h ago', color: '#16a34a' },
  ];

  get statCards() {
    const inv = this.data.inventory();
    const totalStock = inv.reduce((a, i) => a + i.qty, 0);
    const orders = this.data.orders();
    const totalRev = orders.reduce((a, o) => a + o.amount, 0);
    const activeCustomers = this.data.customers().length;
    const activeSuppliers = this.data.suppliers().filter(s => s.status === 'Active').length;
    return [
      { title: 'Total Timber Stock', value: `${totalStock.toLocaleString()} m³`, sub: 'vs last month', trend: 8.4, color: 'var(--primary)' },
      { title: 'Total Sales (Jul)', value: `Rs. ${totalRev.toLocaleString()}`, sub: 'vs last month', trend: 12.6, color: 'var(--accent)' },
      { title: 'Active Customers', value: String(activeCustomers), sub: '1 new this month', trend: 25, color: '#2E6B8A' },
      { title: 'Active Suppliers', value: String(activeSuppliers), sub: '1 inactive', trend: undefined as number | undefined, color: '#d97706' },
    ];
  }

  get lowStockItems() {
    return this.data.inventory().filter(i => i.status !== 'In Stock');
  }

  ngOnInit() {
    this.data.loadInventory();
    this.data.loadOrders();
    this.data.loadCustomers();
    this.data.loadSuppliers();
    this.data.loadDashboardData();
  }

  ngAfterViewInit() { setTimeout(() => this.initCharts(), 100); }

  private initCharts() {
    const canvases = this.chartCanvases.toArray();
    if (canvases.length < 2) return;
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(196,133,58,0.15)' : 'rgba(92,46,14,0.12)';
    const textColor = isDark ? '#A07850' : '#8C6D52';

    const revCtx = canvases[0].nativeElement.getContext('2d')!;
    const revGrad = revCtx.createLinearGradient(0, 0, 0, 220);
    revGrad.addColorStop(0, 'rgba(92,46,14,0.18)');
    revGrad.addColorStop(1, 'rgba(92,46,14,0)');
    const expGrad = revCtx.createLinearGradient(0, 0, 0, 220);
    expGrad.addColorStop(0, 'rgba(61,122,84,0.18)');
    expGrad.addColorStop(1, 'rgba(61,122,84,0)');

    const revData = this.data.revenueData();
    const pData = this.data.pieData();

    this.charts.push(new Chart(revCtx, {
      type: 'line',
      data: {
        labels: revData.map(d => d.month),
        datasets: [
          { label: 'Revenue', data: revData.map(d => d.revenue), borderColor: '#5C2E0E', backgroundColor: revGrad, fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 },
          { label: 'Expenses', data: revData.map(d => d.expenses), borderColor: '#3D7A54', backgroundColor: expGrad, fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: textColor, font: { size: 11 } } }, tooltip: { callbacks: { label: (ctx: any) => `Rs. ${(ctx.raw as number).toLocaleString()}` } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, callback: (v: any) => `${v / 1000}k` } },
        },
      },
    }));

    const pieCtx = canvases[1].nativeElement.getContext('2d')!;
    this.charts.push(new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: pData.map(d => d.name),
        datasets: [{ data: pData.map(d => d.value), backgroundColor: this.data.PIE_COLORS, borderWidth: 2, borderColor: isDark ? '#2A1808' : '#fff' }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.raw}%` } } },
        cutout: '60%',
      },
    }));
  }

  ngOnDestroy() { this.charts.forEach(c => c.destroy()); }
}
