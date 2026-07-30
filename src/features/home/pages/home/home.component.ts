import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';
import { ScrollingClientsComponent } from '../../../../shared/components/scrolling-clients/scrolling-clients.component';
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
    ScrollingClientsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  company = COMPANY_DETAILS;
  stats = COMPANY_STATS;
  services = CORE_SERVICES;
  whyUs = WHY_CHOOSE_US;
}