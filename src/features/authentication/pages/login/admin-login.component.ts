import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LogoComponent],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  responseMessage = signal<string | undefined>(undefined);
  showPassword = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.responseMessage.set(undefined);
    this.isSubmitting.set(true);

    const credentials = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/ops/adminportal']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.responseMessage.set('Login failed. Please check your admin credentials.');
        console.error('Login error:', err);
      },
    });
  }
}