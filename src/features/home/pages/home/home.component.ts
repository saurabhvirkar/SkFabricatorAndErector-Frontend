import { Component, inject, OnDestroy, PLATFORM_ID, OnInit, signal, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactUsComponent } from '../../../contact/pages/contact/contact-us.component';
import { RouterLink } from '@angular/router';
import { AboutDetailsComponent } from '../../../about/pages/about/about-details.component';
import { ServiceService } from '../../../our-services/services/service.service';
import { Service } from '../../../our-services/models/service.model';
import { HomeSlider } from '../../models/home-slider.model';
import { HomeSliderService } from '../../services/home-slider.service';
import { ScrollingClientsComponent } from '../../../../shared/components/scrolling-clients/scrolling-clients.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ContactUsComponent,
    RouterLink,
    AboutDetailsComponent,
    ScrollingClientsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly serviceService = inject(ServiceService);
  private readonly homeSliderService = inject(HomeSliderService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);

  featuredServices = signal<Service[]>([]);
  backgroundSlides = signal<HomeSlider[]>([]);
  currentSlideIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  heroTitle = signal<string>('SK Fabricator & Erector');
  heroDescription = signal<string>('Perfection Through Precision in Structural Steel Fabrication & Erection.');

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