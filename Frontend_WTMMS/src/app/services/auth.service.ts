import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'wtmms_jwt_token';
  private readonly ROLE_KEY = 'wtmms_user_role';
  
  isAuthenticated = signal<boolean>(this.hasToken());
  userRole = signal<string | null>(localStorage.getItem('wtmms_user_role'));

  login(credentials: any) {
    return this.http.post<{ token: string, user: any }>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          if (res.user && res.user.role) {
            localStorage.setItem(this.ROLE_KEY, res.user.role);
            this.userRole.set(res.user.role);
          }
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.isAuthenticated.set(false);
    this.userRole.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
