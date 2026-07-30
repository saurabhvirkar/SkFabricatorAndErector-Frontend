import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CORE_SERVICES, ServiceItem, COMPANY_DETAILS } from '../../../../app/core/data/company-content';
import { ServiceService } from '../../services/service.service';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';
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
    WeldSeamDividerComponent,
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
          const updated = CORE_SERVICES.map(coreSvc => {
            const match = apiServices.find(s => s.name?.toLowerCase().includes(coreSvc.title.toLowerCase()) || coreSvc.title.toLowerCase().includes(s.name?.toLowerCase()));
            return {
              ...coreSvc,
              imageUrl: match?.imageUrl || coreSvc.imageUrl
            };
          });
          this.services.set(updated);
        }
      },
      error: () => {}
    });
  }

  selectService(slug: string): void {
    this.router.navigate(['/our-services', slug]);
  }
}