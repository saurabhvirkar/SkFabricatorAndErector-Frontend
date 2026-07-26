import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { DashboardStats } from '../../../dashboard/models/dashboard-stats.model';
import { InquiryService } from '../../../inquiries/services/inquiry.service';
import { Inquiry } from '../../../inquiries/models/inquiry.model';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    LoadingStateComponent,
    ErrorStateComponent,
    AdminPageHeaderComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly inquiryService = inject(InquiryService);

  stats = signal<DashboardStats | null>(null);
  recentInquiries = signal<Inquiry[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });

    this.inquiryService.getInquiries().subscribe({
      next: (inquiries) => {
        this.recentInquiries.set(inquiries.slice(0, 5));
      },
      error: () => {}
    });
  }
}
