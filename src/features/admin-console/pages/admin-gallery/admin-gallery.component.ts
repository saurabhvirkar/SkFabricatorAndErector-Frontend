import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { GalleryService } from '../../../gallery/services/gallery.service';
import { GalleryImage } from '../../../gallery/models/gallery-image.model';
import { PhotoDialogComponent } from './photo-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { AdminPaginatorComponent } from '../../components/admin-paginator/admin-paginator.component';

@Component({
  selector: 'app-admin-gallery',
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
  templateUrl: './admin-gallery.component.html',
  styleUrls: ['./admin-gallery.component.scss']
})
export class AdminGalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly modalService = inject(NgbModal);
  private readonly snackBar = inject(MatSnackBar);

  images = signal<GalleryImage[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  categories = ['All', 'Piping', 'Fabrication', 'Erection', 'Maintenance'];
  selectedCategory = signal<string>('All');

  page = signal(1);
  pageSize = signal(5);

  filteredPhotos = computed(() => {
    const cat = this.selectedCategory();
    const all = this.images();
    if (cat === 'All') return all;
    return all.filter(img => img.category?.toLowerCase() === cat.toLowerCase());
  });

  paginatedPhotos = computed(() => {
    const list = this.filteredPhotos();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.galleryService.getPhotos().subscribe({
      next: (data) => {
        this.images.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching gallery photos:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    this.page.set(1);
  }

  openUploadDialog(): void {
    const modalRef = this.modalService.open(PhotoDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.result.then((result) => {
      if (result?.formData) {
        this.galleryService.uploadImage(result.formData).subscribe({
          next: () => {
            this.snackBar.open('Photo uploaded successfully', 'Close', { duration: 3000 });
            this.loadPhotos();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to upload photo', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  deletePhoto(photo: GalleryImage): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.title = 'Delete Photo';
    modalRef.componentInstance.message = 'Are you sure you want to delete this gallery photo? This action cannot be undone.';
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.isDanger = true;

    modalRef.result.then((confirmed: boolean) => {
      if (confirmed) {
        this.galleryService.deleteImage(photo.id).subscribe({
          next: () => {
            this.snackBar.open('Photo deleted successfully', 'Close', { duration: 3000 });
            this.loadPhotos();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to delete photo', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }
}
