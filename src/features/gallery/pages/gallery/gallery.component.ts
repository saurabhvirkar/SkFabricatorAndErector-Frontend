import { ChangeDetectionStrategy, Component, computed, signal, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/auth/auth.service';
import { GalleryImage } from '../../models/gallery-image.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../services/gallery.service';

type ImageCategory = 'All' | 'Piping' | 'Fabrication' | 'Erection' | 'Maintenance';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class GalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly authService = inject(AuthService);

  currentYear = new Date().getFullYear();
  categories: ImageCategory[] = ['All', 'Piping', 'Fabrication', 'Erection', 'Maintenance'];

  images = signal<GalleryImage[]>([]);
  selectedFile: File | null = null;
  selectedCategoryForUpload = signal<ImageCategory | null>(null);
  isAboutSliderChecked = signal(false);

  activeFilter = signal<ImageCategory>('All'); 
  selectedImage = signal<GalleryImage | null>(null);

  isLoggedIn = toSignal(this.authService.isLoggedIn$, { initialValue: false });
  currentUserRole = toSignal(this.authService.currentUserRole$, { initialValue: null });
  uploadCategories = computed(() => this.categories.filter(c => c !== 'All'));

  isAdminOrManager = computed(() => {
    const role = this.currentUserRole()?.toLowerCase();
    return role === 'admin' || role === 'manager';
  });

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.galleryService.getImages(this.activeFilter()).subscribe({
      next: (images) => {
        this.images.set(images);
      },
      error: (err) => {
        console.error('Failed to load images', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onCategorySelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategoryForUpload.set(target.value as ImageCategory);
  }

  onUpload(): void {
    if (!this.selectedFile) {
      alert('Please select a file first!');
      return;
    }
    if (!this.selectedCategoryForUpload()) {
      alert('Please select a category for the image!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.galleryService.uploadImage(formData, this.selectedCategoryForUpload()!, this.isAboutSliderChecked()).subscribe({
      next: () => {
        alert('Image uploaded successfully!');
        this.selectedFile = null;
        this.selectedCategoryForUpload.set(null);
        this.isAboutSliderChecked.set(false);
        this.loadImages();
        const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        console.error('Upload failed', err);
        alert('Image upload failed!');
      }
    });
  }

  onDeletePhoto(id: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.galleryService.deleteImage(id).subscribe({
        next: () => {
          alert('Image deleted successfully!');
          this.loadImages();
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Image deletion failed!');
        }
      });
    }
  }

  setFilter(category: ImageCategory) {
    this.activeFilter.set(category);
    this.loadImages();
  }

  openLightbox(image: GalleryImage) {
    this.selectedImage.set(image);
  }

  closeLightbox() {
    this.selectedImage.set(null);
  }
}