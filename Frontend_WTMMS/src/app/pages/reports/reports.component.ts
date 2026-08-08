import { Component, inject, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly data = inject(DataService);
  @ViewChildren('chartCanvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  private charts: Chart[] = [];

  ngOnInit() {
    this.data.loadReportsData();
  }

  downloadPDF() {
    window.print();
  }

  ngAfterViewInit() { setTimeout(() => this.initCharts(), 100); }

  private initCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(196,133,58,0.15)' : 'rgba(92,46,14,0.12)';
    const textColor = isDark ? '#A07850' : '#8C6D52';
    const canvases = this.canvases.toArray();
    if (canvases.length < 4) return;

    const commonOpts = (yFmt: (v: number) => string) => ({
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor, font: { size: 11 } } }, tooltip: { callbacks: { label: (ctx: any) => yFmt(ctx.raw) } } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, callback: (v: any) => yFmt(v) } },
      },
    });

    const revData = this.data.revenueData();
    const invChartData = this.data.inventoryChartData();

    // Sales Trend
    this.charts.push(new Chart(canvases[0].nativeElement, {
      type: 'line',
      data: {
        labels: revData.map(d => d.month),
        datasets: [
          { label: 'Revenue', data: revData.map(d => d.revenue), borderColor: '#5C2E0E', tension: 0.4, pointRadius: 3, borderWidth: 2.5, backgroundColor: 'transparent' },
          { label: 'Profit', data: revData.map(d => d.profit), borderColor: '#3D7A54', tension: 0.4, pointRadius: 3, borderWidth: 2.5, backgroundColor: 'transparent' },
        ],
      },
      options: commonOpts(v => `Rs. ${v.toLocaleString()}`) as any,
    }));

    // Inventory Value Bar
    this.charts.push(new Chart(canvases[1].nativeElement, {
      type: 'bar',
      data: {
        labels: invChartData.map(d => d.type),
        datasets: [{
          label: 'Value (Rs.)',
          data: invChartData.map(d => d.value),
          backgroundColor: this.data.PIE_COLORS,
          borderRadius: 4,
        }],
      },
      options: commonOpts(v => `${v / 1000}k`) as any,
    }));

    // Monthly Profit Area
    const profCtx = canvases[2].nativeElement.getContext('2d')!;
    const profGrad = profCtx.createLinearGradient(0, 0, 0, 200);
    profGrad.addColorStop(0, 'rgba(61,122,84,0.25)');
    profGrad.addColorStop(1, 'rgba(61,122,84,0)');
    this.charts.push(new Chart(profCtx, {
      type: 'line',
      data: {
        labels: revData.map(d => d.month),
        datasets: [{ label: 'Profit', data: revData.map(d => d.profit), borderColor: '#3D7A54', backgroundColor: profGrad, fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.5 }],
      },
      options: commonOpts(v => `Rs. ${v.toLocaleString()}`) as any,
    }));

    // Stock Quantities Horizontal Bar
    this.charts.push(new Chart(canvases[3].nativeElement, {
      type: 'bar',
      data: {
        labels: invChartData.map(d => d.type),
        datasets: [{ label: 'Quantity (m³)', data: invChartData.map(d => d.qty), backgroundColor: this.data.PIE_COLORS, borderRadius: 4 }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: textColor, font: { size: 11 } } }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.raw} m³` } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        },
      } as any,
    }));
  }

  ngOnDestroy() { this.charts.forEach(c => c.destroy()); }
}
