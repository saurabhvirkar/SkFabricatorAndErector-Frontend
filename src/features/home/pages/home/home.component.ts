import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';
import { SlotImageComponent } from '../../../../shared/components/slot-image/slot-image.component';
import { PageImageService } from '../../../../app/core/services/page-image.service';
import { COMPANY_DETAILS, COMPANY_STATS, CORE_SERVICES, WHY_CHOOSE_US } from '../../../../app/core/data/company-content';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CountUpDirective,
    ScrollRevealDirective,
    WeldSeamDividerComponent,
    SlotImageComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly pageImageService = inject(PageImageService);

  company = COMPANY_DETAILS;
  stats = COMPANY_STATS;
  services = CORE_SERVICES;
  whyUs = WHY_CHOOSE_US;

  whyUsSlots = [
    'home.whyus.icon.customize-service',
    'home.whyus.icon.reliable-services',
    'home.whyus.icon.client-friendly',
    'home.whyus.icon.competitive-prices',
    'home.whyus.icon.timely-delivery',
    'home.whyus.icon.quality-management'
  ];

  ngOnInit(): void {
    this.pageImageService.loadAllSlots().subscribe();
  }
}