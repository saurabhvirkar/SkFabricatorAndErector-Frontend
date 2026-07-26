import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class AdminChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  form: FormGroup;
  isSubmitting = false;
  isSendingOtp = false;
  otpSent = false;
  successMessage = '';
  errorMessage = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]],
      otpCode: ['']
    }, { validators: this.passwordMatchValidator });
  }

  get currentPasswordControl() { return this.form.get('currentPassword'); }
  get newPasswordControl() { return this.form.get('newPassword'); }
  get confirmPasswordControl() { return this.form.get('confirmNewPassword'); }

  get hasMinLength(): boolean {
    const val = this.newPasswordControl?.value || '';
    return val.length >= 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPasswordControl?.value || '');
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.newPasswordControl?.value || '');
  }

  get hasDigit(): boolean {
    return /\d/.test(this.newPasswordControl?.value || '');
  }

  get hasSpecial(): boolean {
    return /[^A-Za-z0-9]/.test(this.newPasswordControl?.value || '');
  }

  get isPasswordPolicyValid(): boolean {
    return this.hasMinLength && this.hasUppercase && this.hasLowercase && this.hasDigit && this.hasSpecial;
  }

  private passwordMatchValidator(g: FormGroup) {
    const newPass = g.get('newPassword')?.value;
    const confirmPass = g.get('confirmNewPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  requestOtp(): void {
    this.isSendingOtp = true;
    this.errorMessage = '';
    this.authService.requestOtp('ChangePasswordStepUp').subscribe({
      next: () => {
        this.isSendingOtp = false;
        this.otpSent = true;
      },
      error: (err) => {
        this.isSendingOtp = false;
        this.errorMessage = err.error?.message || 'Failed to send OTP verification code.';
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.isPasswordPolicyValid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      currentPassword: this.form.value.currentPassword,
      newPassword: this.form.value.newPassword,
      confirmNewPassword: this.form.value.confirmNewPassword,
      otpCode: this.form.value.otpCode || undefined
    };

    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Password changed successfully. Active sessions have been logged out. Please log in again.';
        setTimeout(() => {
          this.authService.logout();
        }, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (Array.isArray(err.error?.data)) {
          this.errorMessage = err.error.data.join(' ');
        } else {
          this.errorMessage = err.error?.message || 'Password change failed. Please verify your current password.';
        }
      }
    });
  }
}
