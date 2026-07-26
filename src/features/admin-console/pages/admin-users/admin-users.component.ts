import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../../core/auth/auth.service';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule, AdminPageHeaderComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  private readonly authService = inject(AuthService);
  userRole = signal<string | null>(null);

  constructor() {
    this.authService.currentUserRole$.subscribe(role => {
      this.userRole.set(role);
    });
  }
}
