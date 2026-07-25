import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GalleryImage } from '../../../gallery/models/gallery-image.model';
import { GalleryService } from '../../../gallery/services/gallery.service';

@Component({
  selector: 'app-about-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-details.component.html',
  styleUrls: ['./about-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDetailsComponent implements OnInit, OnDestroy {
  private readonly galleryService = inject(GalleryService);
  private readonly platformId = inject(PLATFORM_ID);

  sectionImages = signal<GalleryImage[]>([]);
  currentSlideIndex = 0;
  intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadAboutSliderImages();
  }

  loadAboutSliderImages(): void {
    this.galleryService.getPhotos().subscribe({
      next: (images) => {
        this.sectionImages.set(images.filter(image => image.isAboutSlider));
        if (this.sectionImages().length > 1) {
          this.startSlider();
        }
      },
      error: (err) => {
        console.error('Failed to load about slider images', err);
      }
    });
  }

  startSlider(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    const totalSlides = this.sectionImages().length;
    if (totalSlides === 0) return;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % totalSlides;
  }

  prevSlide(): void {
    const totalSlides = this.sectionImages().length;
    if (totalSlides === 0) return;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + totalSlides) % totalSlides;
  }

  changeSlide(direction: number): void {
    const totalSlides = this.sectionImages().length;
    if (totalSlides === 0) return;
    this.currentSlideIndex = (this.currentSlideIndex + direction + totalSlides) % totalSlides;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}