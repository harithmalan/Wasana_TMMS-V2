import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position:fixed; top:1rem; right:1rem; z-index:9999; display:flex; flex-direction:column; gap:0.5rem; pointer-events:none;">
      @for (t of toast.toasts(); track t.id) {
        <div style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; border-radius:0.5rem; box-shadow:0 4px 12px rgba(0,0,0,0.15); min-width:16rem; max-width:22rem; pointer-events:all; animation:slideIn 0.2s ease;"
          [style.background]="t.type === 'success' ? '#f0fdf4' : t.type === 'error' ? '#fef2f2' : '#eff6ff'"
          [style.border]="t.type === 'success' ? '1px solid #bbf7d0' : t.type === 'error' ? '1px solid #fecaca' : '1px solid #bfdbfe'">
          <svg style="width:1rem; height:1rem; flex-shrink:0;"
            [style.color]="t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#2563eb'"
            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            @if (t.type === 'success') {
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            } @else if (t.type === 'error') {
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            } @else {
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            }
          </svg>
          <span style="font-size:0.875rem; font-weight:600; flex:1;"
            [style.color]="t.type === 'success' ? '#166534' : t.type === 'error' ? '#991b1b' : '#1e40af'">
            {{ t.message }}
          </span>
          <button (click)="toast.remove(t.id)" style="background:none; border:none; cursor:pointer; opacity:0.5; padding:0; display:flex;">
            <svg style="width:0.875rem; height:0.875rem;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
    <style>
      @keyframes slideIn { from { opacity:0; transform:translateX(1rem); } to { opacity:1; transform:translateX(0); } }
    </style>
  `,
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
