import { Component, computed, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Inquiry } from '../../models/inquiry.model';
import { InquiryService } from '../../services/inquiry.service';

@Component({
  selector: 'app-inquiry-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush, 
  templateUrl: './inquiry-details.component.html',
  styleUrls: ['./inquiry-details.component.scss']
})
export class InquiryDetailsComponent implements OnInit {
  private readonly inquiryService = inject(InquiryService);
  isFetching = signal(true);
  totalInquiries = signal<Inquiry[]>([]);

  private readonly inquiriesObservable: Observable<Inquiry[]> = this.inquiryService.getInquiries().pipe(
    map((inquiries: Inquiry[]) => {
      return inquiries.sort((a, b) => new Date(b.submittedAt ?? 0).getTime() - new Date(a.submittedAt ?? 0).getTime());
    }),
    map(inquiries => {
      this.isFetching.set(false);
      return inquiries;
    })
  );

  ngOnInit(): void {
    this.inquiriesObservable.subscribe({
      next: inquiries => this.totalInquiries.set(inquiries),
      error: err => {
        this.isFetching.set(false);
        console.error('Failed to load inquiries', err);
      }
    });
  }
  
  pageSize = signal(10);
  currentPage = signal(1);

  totalPages = computed(() => {
    const totalCount = this.totalInquiries()?.length || 0;
    return Math.ceil(totalCount / this.pageSize());
  });

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  
  endIndex = computed(() => {
    const totalCount = this.totalInquiries()?.length || 0;
    return Math.min(this.startIndex() + this.pageSize(), totalCount);
  });

  paginatedInquiries = computed(() => {
    const inquiries = this.totalInquiries();
    if (!inquiries || inquiries.length === 0) {
      return [];
    }
    return inquiries.slice(this.startIndex(), this.endIndex());
  });

  checkPageBounds = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    if (current > total && total > 0) {
      this.currentPage.set(total);
    }
    return null;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    if (total <= 1) return [];

    const pageNumbers: number[] = [];
    for (let i = 1; i <= total; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  deleteInquiry(id: number | undefined): void {
    if (id === undefined) return;

    if (confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      this.inquiryService.deleteInquiry(id).subscribe({
        next: () => {
          this.totalInquiries.update(currentInquiries => 
            currentInquiries.filter(inq => inq.id !== id)
          );
        },
        error: (err) => console.error(`Failed to delete inquiry ${id}`, err),
      });
    }
  }

  isModalOpen = signal(false);
  selectedInquiry = signal<Inquiry | null>(null);

  openModal(inquiry: Inquiry): void {
    this.selectedInquiry.set(inquiry);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedInquiry.set(null);
  }
}
