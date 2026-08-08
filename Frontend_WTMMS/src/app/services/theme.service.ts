import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark = signal(false);
  readonly dark = this._dark.asReadonly();

  toggle(): void {
    this._dark.update(d => !d);
    document.documentElement.classList.toggle('dark', this._dark());
  }
}
