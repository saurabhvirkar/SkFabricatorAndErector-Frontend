import { ChangeDetectionStrategy, Component, signal, OnInit, inject } from '@angular/core';
import { GalleryImage } from '../../models/gallery-image.model';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../services/gallery.service';

type ImageCategory = 'All' | 'Piping' | 'Fabrication' | 'Erection' | 'Maintenance';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class GalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);

  currentYear = new Date().getFullYear();
  categories: ImageCategory[] = ['All', 'Piping', 'Fabrication', 'Erection', 'Maintenance'];

  images = signal<GalleryImage[]>([]);
  activeFilter = signal<ImageCategory>('All');
  selectedImage = signal<GalleryImage | null>(null);

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

  setFilter(category: ImageCategory): void {
    this.activeFilter.set(category);
    this.loadImages();
  }

  openLightbox(image: GalleryImage): void {
    this.selectedImage.set(image);
  }

  closeLightbox(): void {
    this.selectedImage.set(null);
  }
}