import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HomeSliderService } from '../../../home/services/home-slider.service';
import { HomeSlider } from '../../../home/models/home-slider.model';
import { SliderDialogComponent } from './slider-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { AdminPaginatorComponent } from '../../components/admin-paginator/admin-paginator.component';

@Component({
  selector: 'app-admin-sliders',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './admin-sliders.component.html',
  styleUrls: ['./admin-sliders.component.scss']
})
export class AdminSlidersComponent implements OnInit {
  private readonly homeService = inject(HomeSliderService);
  private readonly modalService = inject(NgbModal);
  private readonly snackBar = inject(MatSnackBar);

  sliders = signal<HomeSlider[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  sortColumn = signal<string>('title');
  sortDirection = signal<'asc' | 'desc'>('asc');

  page = signal(1);
  pageSize = signal(5);

  filteredSliders = computed(() => {
    let result = [...this.sliders()];
    const col = this.sortColumn();
    const dir = this.sortDirection();

    if (col) {
      result.sort((a, b) => {
        let valA = (a as any)[col] ?? '';
        let valB = (b as any)[col] ?? '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  paginatedSliders = computed(() => {
    const list = this.filteredSliders();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.homeService.getHomeSliders().subscribe({
      next: (data) => {
        this.sliders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching home sliders:', err);
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

  openAddDialog(): void {
    const modalRef = this.modalService.open(SliderDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.homeService.addHomeSlider(formData).subscribe({
          next: () => {
            this.snackBar.open('Home slider created successfully', 'Close', { duration: 3000 });
            this.loadSliders();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to create home slider', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  deleteSlider(slider: HomeSlider): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.title = 'Delete Home Slider';
    modalRef.componentInstance.message = `Are you sure you want to delete slider "${slider.title}"? This action cannot be undone.`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.isDanger = true;

    modalRef.result.then((confirmed: boolean) => {
      if (confirmed) {
        this.homeService.deleteHomeSlider(slider.id).subscribe({
          next: () => {
            this.snackBar.open('Home slider deleted successfully', 'Close', { duration: 3000 });
            this.loadSliders();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to delete home slider', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }
}
