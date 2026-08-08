import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modal.confirmState()) {
      <div style="position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;"
        (click)="onBackdrop($event)">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.45);"></div>
        <div style="position:relative;background:var(--card);border-radius:0.75rem;padding:1.5rem;width:100%;max-width:24rem;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:1px solid var(--border);">
          <div style="display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.25rem;">
            <div style="padding:0.625rem;border-radius:0.5rem;background:#fef2f2;flex-shrink:0;">
              <svg style="width:1.25rem;height:1.25rem;color:#dc2626;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <p style="font-size:1rem;font-weight:700;color:var(--foreground);margin-bottom:0.25rem;">{{ modal.confirmState()!.title }}</p>
              <p style="font-size:0.875rem;color:var(--muted-foreground);line-height:1.5;">{{ modal.confirmState()!.message }}</p>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:0.5rem;">
            <button (click)="modal.cancelConfirm()"
              style="padding:0.5rem 1rem;border-radius:0.5rem;border:1px solid var(--border);background:var(--card);color:var(--foreground);font-size:0.875rem;font-weight:600;cursor:pointer;">
              Cancel
            </button>
            <button (click)="modal.acceptConfirm()"
              style="padding:0.5rem 1rem;border-radius:0.5rem;background:#dc2626;color:#fff;font-size:0.875rem;font-weight:600;border:none;cursor:pointer;">
              Delete
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly modal = inject(ModalService);
  onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).style.position === 'absolute') this.modal.cancelConfirm();
  }
}
