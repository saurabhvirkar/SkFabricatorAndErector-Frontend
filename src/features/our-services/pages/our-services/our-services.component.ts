import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CORE_SERVICES, ServiceItem, COMPANY_DETAILS } from '../../../../app/core/data/company-content';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, WeldSeamDividerComponent],
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss']
})
export class OurServicesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  company = COMPANY_DETAILS;
  services = signal<ServiceItem[]>(CORE_SERVICES);
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
  }

  selectService(slug: string): void {
    this.router.navigate(['/our-services', slug]);
  }
}