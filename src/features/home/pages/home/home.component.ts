import { Component, inject, OnDestroy, PLATFORM_ID, OnInit, signal, computed, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactUsComponent } from '../../../contact/pages/contact/contact-us.component';
import { RouterLink } from '@angular/router';
import { AboutDetailsComponent } from '../../../about/pages/about/about-details.component';
import { ServiceService } from '../../../our-services/services/service.service';
import { Service } from '../../../our-services/models/service.model';
import { HomeSlider } from '../../models/home-slider.model';
import { HomeSliderService } from '../../services/home-slider.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScrollingClientsComponent } from '../../../../shared/components/scrolling-clients/scrolling-clients.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ContactUsComponent,
    RouterLink,
    AboutDetailsComponent,
    FormsModule,
    ScrollingClientsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly serviceService = inject(ServiceService);
  private readonly homeSliderService = inject(HomeSliderService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);

  isLoggedIn = toSignal(this.authService.isLoggedIn$, { initialValue: false });
  currentUserRole = toSignal(this.authService.currentUserRole$, { initialValue: null });

  isAdminOrManager = computed(() => {
    const role = this.currentUserRole()?.toLowerCase();
    return role === 'admin' || role === 'manager';
  });

  featuredServices = signal<Service[]>([]);
  backgroundSlides = signal<HomeSlider[]>([]);
  currentSlideIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  heroTitle = signal<string>('');
  heroDescription = signal<string>('');

  ngOnInit(): void {
    this.loadBackgroundSlides();
    this.loadFeaturedServices();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounters();
            obs.unobserve(entry.target);
          }
        });
      }, options);

      const counterSection = this.elementRef.nativeElement.querySelector('.counter-section');
      if (counterSection) {
        observer.observe(counterSection);
      }
    }
  }

  loadFeaturedServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services: Service[]) => {
        this.featuredServices.set(services.slice(0, 3));
      },
      error: (err: unknown) => {
        console.error('Failed to load featured services', err);
      }
    });
  }

  loadBackgroundSlides(): void {
    this.homeSliderService.getHomeSliders().subscribe({
      next: (sliders: HomeSlider[]) => {
        this.backgroundSlides.set(sliders);
        if (sliders.length > 0) {
          this.heroTitle.set(sliders[0].title);
          this.heroDescription.set(sliders[0].description);
        }
        if (isPlatformBrowser(this.platformId) && sliders.length > 0) {
          this.startAutoSlide();
        }
      },
      error: (err: unknown) => {
        console.error('Failed to load home slider items', err);
      }
    });
  }

  onAddHomeSlider(title: string, description: string, file: FileList | null): void {
    if (!title || !description) {
      console.error('Title and Description are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file && file.length > 0) {
      formData.append('file', file[0]);
    }

    this.homeSliderService.addHomeSlider(formData).subscribe({
      next: (newSlider: HomeSlider) => {
        this.backgroundSlides.update(sliders => [...sliders, newSlider]);
        if (this.backgroundSlides().length === 1) {
          this.heroTitle.set(newSlider.title);
          this.heroDescription.set(newSlider.description);
        }
      },
      error: (err: unknown) => {
        console.error('Failed to add home slider item', err);
      }
    });
  }

  onUpdateHomeSlider(id: number, title: string, description: string): void {
    // Legacy template method fallback
    console.log('Update home slider requested:', id, title, description);
  }

  onAddHomeSliderImage(homeSliderId: number, file: FileList | null): void {
    if (!file || file.length === 0) return;
    const formData = new FormData();
    formData.append('file', file[0]);
    formData.append('homeSliderId', homeSliderId.toString());
    this.homeSliderService.addHomeSlider(formData).subscribe({
      next: () => this.loadBackgroundSlides(),
      error: (err) => console.error('Failed to upload image', err)
    });
  }

  onDeleteHomeSlider(id: number): void {
    if (confirm('Are you sure you want to delete this home slider item?')) {
      this.homeSliderService.deleteHomeSlider(id).subscribe({
        next: () => {
          this.backgroundSlides.update(sliders => sliders.filter(s => s.id !== id));
          if (this.backgroundSlides().length > 0) {
            this.heroTitle.set(this.backgroundSlides()[0].title);
            this.heroDescription.set(this.backgroundSlides()[0].description);
          } else {
            this.heroTitle.set('');
            this.heroDescription.set('');
          }
        },
        error: (err: unknown) => {
          console.error('Failed to delete home slider item', err);
        }
      });
    }
  }

  startAutoSlide(): void {
    if (isPlatformBrowser(this.platformId) && this.backgroundSlides().length > 0) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(() => {
        const slides = this.backgroundSlides();
        if (slides.length === 0) return;
        this.currentSlideIndex = (this.currentSlideIndex + 1) % slides.length;
        this.heroTitle.set(slides[this.currentSlideIndex].title);
        this.heroDescription.set(slides[this.currentSlideIndex].description);
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  animateCounters(): void {
    const counters = this.elementRef.nativeElement.querySelectorAll('.counter-item h3');
    counters.forEach((counter: HTMLElement) => {
      const target = +counter.innerText;
      counter.innerText = '0';
      const increment = target / 200;

      const updateCounter = () => {
        const c = +counter.innerText;
        if (c < target) {
          counter.innerText = `${Math.ceil(c + increment)}`;
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target.toString();
        }
      };

      updateCounter();
    });
  }
}