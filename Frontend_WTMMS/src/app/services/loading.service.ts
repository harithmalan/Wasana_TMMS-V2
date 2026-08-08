import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = signal(0);
  private overlayTimer?: ReturnType<typeof setTimeout>;
  private longWaitTimer?: ReturnType<typeof setTimeout>;

  readonly isLoading = signal(false);
  readonly showOverlay = signal(false);
  readonly longWait = signal(false);

  start(): void {
    const wasIdle = this.activeRequests() === 0;
    this.activeRequests.update(n => n + 1);
    this.isLoading.set(true);

    if (wasIdle) {
      this.overlayTimer = setTimeout(() => this.showOverlay.set(true), 3000);
      this.longWaitTimer = setTimeout(() => this.longWait.set(true), 12000);
    }
  }

  stop(): void {
    const next = Math.max(0, this.activeRequests() - 1);
    this.activeRequests.set(next);

    if (next === 0) {
      clearTimeout(this.overlayTimer);
      clearTimeout(this.longWaitTimer);
      this.isLoading.set(false);
      this.showOverlay.set(false);
      this.longWait.set(false);
    }
  }
}
