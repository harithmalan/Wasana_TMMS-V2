import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  template: `
    <div class="wtmms-progress" [class.active]="loading.isLoading()"></div>

    @if (loading.showOverlay()) {
      <div class="wtmms-overlay" role="status" aria-live="polite">
        <div class="wtmms-overlay-card">
          <div class="ring-loader">
            <span class="ring ring-1"></span>
            <span class="ring ring-2"></span>
            <span class="ring ring-3"></span>
            <span class="ring-core"></span>
          </div>
          <h3>{{ loading.longWait() ? 'Waking up the server' : 'Loading' }}</h3>
          <p>
            @if (loading.longWait()) {
              The server's been idle and is starting back up. This can take up to a minute — thanks for your patience.
            } @else {
              Just a moment&hellip;
            }
          </p>
        </div>
      </div>
    }
  `,
  styles: `
    .wtmms-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      z-index: 10000;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .wtmms-progress.active {
      opacity: 1;
    }
    .wtmms-progress.active::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -30%;
      width: 30%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--accent), var(--primary));
      animation: wtmms-slide 1.1s ease-in-out infinite;
    }
    @keyframes wtmms-slide {
      0% { left: -30%; }
      50% { left: 60%; }
      100% { left: 110%; }
    }

    .wtmms-overlay {
      position: fixed;
      inset: 0;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(247, 243, 238, 0.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      animation: wtmms-fade-in 0.25s ease;
    }
    :host-context(.dark) .wtmms-overlay {
      background: rgba(26, 15, 7, 0.75);
    }
    @keyframes wtmms-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .wtmms-overlay-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2.25rem 2.5rem;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 22rem;
      text-align: center;
      animation: wtmms-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes wtmms-pop {
      from { opacity: 0; transform: scale(0.92) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .ring-loader {
      position: relative;
      width: 64px;
      height: 64px;
    }
    .ring-loader .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid transparent;
    }
    .ring-loader .ring-1 {
      border-top-color: var(--accent);
      border-right-color: var(--accent);
      animation: wtmms-spin 1.1s linear infinite;
    }
    .ring-loader .ring-2 {
      inset: 8px;
      border-top-color: var(--primary);
      border-left-color: var(--primary);
      animation: wtmms-spin-reverse 1.6s linear infinite;
    }
    .ring-loader .ring-3 {
      inset: 16px;
      border-bottom-color: var(--accent);
      opacity: 0.6;
      animation: wtmms-spin 2.2s linear infinite;
    }
    .ring-loader .ring-core {
      position: absolute;
      inset: 24px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, var(--accent), var(--primary));
      box-shadow: 0 0 12px rgba(92, 46, 14, 0.35);
      animation: wtmms-pulse 1.6s ease-in-out infinite;
    }
    @keyframes wtmms-spin { to { transform: rotate(360deg); } }
    @keyframes wtmms-spin-reverse { to { transform: rotate(-360deg); } }
    @keyframes wtmms-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.12); }
    }

    .wtmms-overlay-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--foreground);
    }
    .wtmms-overlay-card p {
      font-size: 0.875rem;
      color: var(--muted-foreground);
      line-height: 1.5;
    }
  `,
})
export class LoadingOverlayComponent {
  readonly loading = inject(LoadingService);
}
