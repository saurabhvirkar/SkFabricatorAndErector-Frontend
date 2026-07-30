import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';
import { ScrollingClientsComponent } from '../../../../shared/components/scrolling-clients/scrolling-clients.component';
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
    ScrollingClientsComponent,
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

  whyUs = [
    { title: 'Customized Solutions', desc: 'Engineered tailor-made fabrication to exact site dimensions and pressure ratings.', icon: 'tune', slotKey: 'home.whyus.icon.customize-service' },
    { title: 'Reliable Services', desc: 'Proven track record across 250+ chemical, automotive, and power plant installations.', icon: 'verified', slotKey: 'home.whyus.icon.reliable-services' },
    { title: 'Client-Friendly Approach', desc: 'Single point of contact from initial drawing detailing to commissioning.', icon: 'handshake', slotKey: 'home.whyus.icon.client-friendly' },
    { title: 'Competitive Pricing', desc: 'Optimized fabrication process with modularization to maximize project value.', icon: 'payments', slotKey: 'home.whyus.icon.competitive-prices' },
    { title: 'Timely Delivery', desc: 'We make no commitments we cannot keep; guaranteed completion in record time.', icon: 'schedule', slotKey: 'home.whyus.icon.timely-delivery' },
    { title: 'Quality Management', desc: 'Rigorous inspection standards, NDT testing, and comprehensive documentation.', icon: 'workspace_premium', slotKey: 'home.whyus.icon.quality-management' }
  ];

  ngOnInit(): void {
    this.pageImageService.loadAllSlots().subscribe();
  }
}