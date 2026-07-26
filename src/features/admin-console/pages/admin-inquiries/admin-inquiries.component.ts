import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { InquiryService } from '../../../inquiries/services/inquiry.service';
import { Inquiry } from '../../../inquiries/models/inquiry.model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { AdminPaginatorComponent } from '../../components/admin-paginator/admin-paginator.component';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    NgbModalModule,
    MatSnackBarModule,
    MatIconModule,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    AdminPageHeaderComponent,
    AdminPaginatorComponent
  ],
  templateUrl: './admin-inquiries.component.html',
  styleUrls: ['./admin-inquiries.component.scss']
})
export class AdminInquiriesComponent implements OnInit {
  private readonly inquiryService = inject(InquiryService);
  private readonly modalService = inject(NgbModal);
  private readonly snackBar = inject(MatSnackBar);

  inquiries = signal<Inquiry[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  selectedInquiry = signal<Inquiry | null>(null);

  filterText = signal('');
  sortColumn = signal<string>('submittedAt');
  sortDirection = signal<'asc' | 'desc'>('desc');

  page = signal(1);
  pageSize = signal(5);

  filteredInquiries = computed(() => {
    let result = [...this.inquiries()];
    const query = this.filterText().trim().toLowerCase();

    if (query) {
      result = result.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.email.toLowerCase().includes(query) ||
        (i.subject && i.subject.toLowerCase().includes(query)) ||
        (i.message && i.message.toLowerCase().includes(query))
      );
    }

    const col = this.sortColumn();
    const dir = this.sortDirection();

    if (col) {
      result.sort((a, b) => {
        let valA = (a as any)[col] ?? '';
        let valB = (b as any)[col] ?? '';
        if (col === 'submittedAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  paginatedInquiries = computed(() => {
    const list = this.filteredInquiries();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.inquiryService.getInquiries().subscribe({
      next: (data) => {
        this.inquiries.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading inquiries:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
    this.page.set(1);
  }

  openDetailModal(inquiry: Inquiry): void {
    this.selectedInquiry.set(inquiry);
  }

  closeModal(): void {
    this.selectedInquiry.set(null);
  }

  deleteInquiry(inquiry: Inquiry): void {
    if (!inquiry.id) return;

    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.title = 'Delete Inquiry';
    modalRef.componentInstance.message = `Are you sure you want to delete inquiry from "${inquiry.name}"? This operation cannot be undone.`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.isDanger = true;

    modalRef.result.then((confirmed: boolean) => {
      if (confirmed && inquiry.id) {
        this.inquiryService.deleteInquiry(inquiry.id).subscribe({
          next: () => {
            this.snackBar.open('Inquiry deleted successfully', 'Close', { duration: 3000 });
            this.closeModal();
            this.loadInquiries();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to delete inquiry', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }
}
