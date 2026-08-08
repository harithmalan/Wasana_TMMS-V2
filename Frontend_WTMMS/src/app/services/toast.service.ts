import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 1;

  show(message: string, type: Toast['type'] = 'success'): void {
    const id = this.nextId++;
    this._toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number): void {
    this._toasts.update(t => t.filter(x => x.id !== id));
  }
}
