import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  email = 'premasiri@wasana.lk';
  password = 'password';
  showPassword = signal(false);
  errorMsg = signal('');

  togglePassword() { this.showPassword.update(v => !v); }

  onSubmit() { 
    this.errorMsg.set('');
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        console.error('Login error', err);
        if (err.status === 0) {
            this.errorMsg.set('Network or CORS error. Backend unreachable.');
        } else if (err.status === 401) {
            this.errorMsg.set('Incorrect email or password.');
        } else {
            this.errorMsg.set('Error: ' + err.message);
        }
      }
    });
  }
}
