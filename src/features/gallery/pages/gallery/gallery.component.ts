import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryImage } from '../../models/gallery-image.model';
import { GalleryService } from '../../services/gallery.service';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';

export type ImageCategory = 'All' | 'Piping' | 'Fabrication' | 'Erection' | 'Maintenance' | 'Storage Tanks';

const SAMPLE_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 101,
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    category: 'Piping',
    isAboutSlider: false
  },
  {
    id: 102,
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    category: 'Fabrication',
    isAboutSlider: false
  },
  {
    id: 103,
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    category: 'Erection',
    isAboutSlider: false
  },
  {
    id: 104,
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    category: 'Maintenance',
    isAboutSlider: false
  },
  {
    id: 105,
    url: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
    category: 'Storage Tanks',
    isAboutSlider: false
  },
  {
    id: 106,
    url: 'https://images.unsplash.com/photo-1574689231351-85750058b871?auto=format&fit=crop&w=1200&q=80',
    category: 'Piping',
    isAboutSlider: false
  },
  {
    id: 107,
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    category: 'Fabrication',
    isAboutSlider: false
  },
  {
    id: 108,
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
    category: 'Erection',
    isAboutSlider: false
  },
  {
    id: 109,
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
    category: 'Maintenance',
    isAboutSlider: false
  },
  {
    id: 110,
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    category: 'Storage Tanks',
    isAboutSlider: false
  },
  {
    id: 111,
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    category: 'Piping',
    isAboutSlider: false
  },
  {
    id: 112,
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    category: 'Maintenance',
    isAboutSlider: false
  }
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    ScrollRevealDirective
  ],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);

  categories: ImageCategory[] = ['All', 'Piping', 'Fabrication', 'Erection', 'Maintenance', 'Storage Tanks'];

  images = signal<GalleryImage[]>(SAMPLE_GALLERY_IMAGES);
  activeFilter = signal<ImageCategory>('All');
  selectedImage = signal<GalleryImage | null>(null);

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.galleryService.getImages(this.activeFilter()).subscribe({
      next: (fetchedImages) => {
        if (fetchedImages && fetchedImages.length > 0) {
          this.images.set(fetchedImages);
        } else {
          // Filter sample images by active filter
          if (this.activeFilter() === 'All') {
            this.images.set(SAMPLE_GALLERY_IMAGES);
          } else {
            this.images.set(SAMPLE_GALLERY_IMAGES.filter(img => img.category === this.activeFilter()));
          }
        }
      },
      error: () => {
        if (this.activeFilter() === 'All') {
          this.images.set(SAMPLE_GALLERY_IMAGES);
        } else {
          this.images.set(SAMPLE_GALLERY_IMAGES.filter(img => img.category === this.activeFilter()));
        }
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