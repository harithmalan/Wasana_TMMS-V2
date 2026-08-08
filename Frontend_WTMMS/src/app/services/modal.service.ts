import { Injectable, signal } from '@angular/core';

export interface ConfirmState {
  title: string;
  message: string;
  onAccept: () => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly confirmState = signal<ConfirmState | null>(null);

  confirm(title: string, message: string, onAccept: () => void): void {
    this.confirmState.set({ title, message, onAccept });
  }

  acceptConfirm(): void {
    this.confirmState()?.onAccept();
    this.confirmState.set(null);
  }

  cancelConfirm(): void {
    this.confirmState.set(null);
  }
}
