import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { InquiryService } from '../../../inquiries/services/inquiry.service';
import { Inquiry } from '../../../inquiries/models/inquiry.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly inquiryService = inject(InquiryService);

  stats = signal<DashboardStats | null>(null);
  recentInquiries = signal<Inquiry[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => {
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
