import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';
import { SlotImageComponent } from '../../../../shared/components/slot-image/slot-image.component';
import { ClientShowcaseComponent } from '../../../../shared/components/client-showcase/client-showcase.component';
import { PageImageService } from '../../../../app/core/services/page-image.service';
import { CompanyPdfService } from '../../../../app/core/services/company-pdf.service';
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
    SlotImageComponent,
    ClientShowcaseComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly pageImageService = inject(PageImageService);
  private readonly pdfService = inject(CompanyPdfService);

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

  whyUsPillars = [
    {
      title: 'Customized Solutions',
      badge: 'Site-Tailored',
      desc: 'Engineered tailor-made fabrication to exact site dimensions, ASME/IS pressure ratings, and custom tolerances.',
      icon: 'tune',
      highlight: 'Tailored Dimensions'
    },
    {
      title: 'Reliable Services',
      badge: '250+ Projects',
      desc: 'Proven track record across 250+ chemical, automotive, pharma, and power plant installations.',
      icon: 'verified',
      highlight: 'Proven Site Track Record'
    },
    {
      title: 'Client-Friendly Approach',
      badge: 'Single Point EPC',
      desc: 'Single point of contact from initial drawing detailing & material selection to site commissioning.',
      icon: 'handshake',
      highlight: 'Single-Source Point of Contact'
    },
    {
      title: 'Competitive Pricing',
      badge: 'Cost Optimized',
      desc: 'Optimized fabrication process with modular shop pre-assembly to maximize project ROI.',
      icon: 'payments',
      highlight: 'Modular Value Optimization'
    },
    {
      title: 'Timely Delivery',
      badge: 'Record Turnaround',
      desc: 'We make no commitments we cannot keep; guaranteed completion in record time with zero schedule slippage.',
      icon: 'schedule',
      highlight: 'On-Time Guarantee'
    },
    {
      title: 'Quality & Safety First',
      badge: '100% Inspected',
      desc: 'Rigorous NDT testing, certified SMAW/TIG welding specialists, and complete MTR documentation.',
      icon: 'workspace_premium',
      highlight: 'NDT & Radiography Verified'
    }
  ];

  ngOnInit(): void {
    this.pageImageService.loadAllSlots().subscribe();
  }

  downloadPdf(): void {
    this.pdfService.downloadPdf();
  }
}