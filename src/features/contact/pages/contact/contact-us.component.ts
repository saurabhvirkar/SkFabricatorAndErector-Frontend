import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { InquiryFormComponent } from '../../../inquiries/pages/inquiry-form/inquiry-form.component';
import { COMPANY_DETAILS } from '../../../../app/core/data/company-content';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    InquiryFormComponent,
    ScrollRevealDirective,
    WeldSeamDividerComponent
  ],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  company = COMPANY_DETAILS;
}