import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CORE_SERVICES, ServiceItem, COMPANY_DETAILS } from '../../../../app/core/data/company-content';
import { ServiceService } from '../../services/service.service';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { SlotImageComponent } from '../../../../shared/components/slot-image/slot-image.component';
import { PageImageService } from '../../../../app/core/services/page-image.service';

export interface ExtendedServiceItem extends ServiceItem {
  imageUrl?: string;
}

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ScrollRevealDirective,
    SlotImageComponent
  ],
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss']
})
export class OurServicesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serviceService = inject(ServiceService);
  private pageImageService = inject(PageImageService);

  company = COMPANY_DETAILS;
  services = signal<ExtendedServiceItem[]>(CORE_SERVICES);
  activeSlug = signal<string | null>(null);

  selectedService = computed(() => {
    const slug = this.activeSlug();
    if (!slug) return null;
    return this.services().find(s => s.slug === slug) || null;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      this.activeSlug.set(slug);
    });

    this.pageImageService.loadAllSlots().subscribe();
    this.loadLiveServices();
  }

  loadLiveServices(): void {
    this.serviceService.getServices().subscribe({
      next: (apiServices) => {
        if (apiServices && apiServices.length > 0) {
          const mapped: ExtendedServiceItem[] = apiServices.map(apiSvc => {
            const fallback = CORE_SERVICES.find(cs => cs.slug === apiSvc.slug || cs.title.toLowerCase() === apiSvc.name?.toLowerCase()) || CORE_SERVICES[0];
            
            let parsedBullets: string[] = [];
            if (apiSvc.bulletsJson) {
              try {
                parsedBullets = JSON.parse(apiSvc.bulletsJson);
              } catch {
                parsedBullets = fallback.bullets;
              }
            } else {
              parsedBullets = fallback.bullets;
            }

            return {
              slug: apiSvc.slug || fallback.slug,
              title: apiSvc.name || fallback.title,
              subtitle: apiSvc.subtitle || fallback.subtitle,
              teaser: apiSvc.teaser || apiSvc.summary || fallback.teaser,
              description: apiSvc.description || fallback.description,
              iconName: apiSvc.iconName || fallback.iconName,
              bulletTitle: apiSvc.bulletTitle || fallback.bulletTitle,
              bullets: parsedBullets.length > 0 ? parsedBullets : fallback.bullets,
              photoPlaceholder: apiSvc.photoPlaceholder || fallback.photoPlaceholder,
              featured: apiSvc.featured ?? fallback.featured,
              imageUrl: apiSvc.imageUrl || fallback.imageUrl
            };
          });

          this.services.set(mapped);
        }
      },
      error: () => {}
    });
  }

  selectService(slug: string): void {
    this.router.navigate(['/our-services', slug]);
  }
}