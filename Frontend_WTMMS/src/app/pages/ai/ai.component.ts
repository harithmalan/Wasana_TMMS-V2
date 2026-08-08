import { Component, inject, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai.component.html',
})
export class AiComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly data = inject(DataService);
  private http = inject(HttpClient);
  
  @ViewChildren('chartCanvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  private charts: Chart[] = [];

  // User input for prediction
  weeklyPrices = '100, 110, 120, 130';
  predictionResult = signal<number | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  readonly recommendations = [
    { type: 'Teak Wood', action: 'Reorder Now', qty: '300 m³', urgency: 'High', reason: 'Demand surge predicted in August. Lead time 3 weeks from Ruhunu Wood Suppliers.', bg: '#fef2f2', border: '#fecaca', badge: { bg: '#fee2e2', color: '#991b1b' } },
    { type: 'Coconut Timber', action: 'Critical Reorder', qty: '150 m³', urgency: 'Critical', reason: 'Below reorder threshold. Stock projected to deplete in 18 days.', bg: '#fef2f2', border: '#fca5a5', badge: { bg: '#fee2e2', color: '#991b1b' } },
    { type: 'Jack Wood', action: 'Monitor Closely', qty: '100 m³', urgency: 'Medium', reason: 'Moderate demand increase projected. Review in 2 weeks.', bg: '#fffbeb', border: '#fde68a', badge: { bg: '#fef3c7', color: '#92400e' } },
    { type: 'Mahogany Timber', action: 'Maintain Stock', qty: '—', urgency: 'Low', reason: 'Demand stable. Current stock adequate for 8+ weeks.', bg: '#f0fdf4', border: '#bbf7d0', badge: { bg: '#dcfce7', color: '#166534' } },
    { type: 'Satin Wood', action: 'Reorder Soon', qty: '80 m³', urgency: 'High', reason: 'Approaching reorder point. Supply takes 4 weeks from Kandy Timber Traders.', bg: '#fffbeb', border: '#fde68a', badge: { bg: '#fef3c7', color: '#92400e' } },
    { type: 'Coconut Timber', action: 'Overstocked', qty: '—', urgency: 'Low', reason: 'Current stock 2.6× above reorder point. No action needed.', bg: '#eff6ff', border: '#bfdbfe', badge: { bg: '#dbeafe', color: '#1e40af' } },
  ];

  ngOnInit() {
    this.data.loadAiData();
  }

  predictPrice() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.predictionResult.set(null);

    const prices = this.weeklyPrices.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    
    if (prices.length < 2) {
      this.errorMessage.set("Please enter at least 2 valid numbers separated by commas.");
      this.isLoading.set(false);
      return;
    }

    this.http.post<{ predicted_price: number }>('http://localhost:5000/predict', { prices }).subscribe({
      next: (res) => {
        this.predictionResult.set(res.predicted_price);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set("Failed to get prediction from AI service. Is the Python backend running?");
        this.isLoading.set(false);
      }
    });
  }

  ngAfterViewInit() { setTimeout(() => this.initChart(), 100); }

  private initChart() {
    const canvases = this.canvases.toArray();
    if (!canvases.length) return;
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(196,133,58,0.15)' : 'rgba(92,46,14,0.12)';
    const textColor = isDark ? '#A07850' : '#8C6D52';
    
    const fcData = this.data.aiForecastData();

    this.charts.push(new Chart(canvases[0].nativeElement, {
      type: 'line',
      data: {
        labels: fcData.map(d => d.week),
        datasets: [
          {
            label: 'Actual (m³)',
            data: fcData.map(d => d.actual),
            borderColor: '#5C2E0E', borderWidth: 2.5, pointRadius: 3,
            backgroundColor: 'transparent', spanGaps: false,
          },
          {
            label: 'AI Predicted',
            data: fcData.map(d => d.predicted),
            borderColor: '#C4853A', borderWidth: 2, borderDash: [6, 3],
            pointRadius: 0, backgroundColor: 'transparent',
          },
          {
            label: 'Projected Demand',
            data: fcData.map(d => d.demand),
            borderColor: '#3D7A54', borderWidth: 1.5, borderDash: [4, 4],
            pointRadius: 0, backgroundColor: 'transparent',
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: textColor, font: { size: 11 } } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
          y: { min: 600, max: 1200, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        },
      } as any,
    }));
  }

  ngOnDestroy() { this.charts.forEach(c => c.destroy()); }
}
