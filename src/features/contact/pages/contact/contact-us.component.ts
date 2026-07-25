import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { InquiryFormComponent } from '../../../inquiries/pages/inquiry-form/inquiry-form.component';
import { CONTACT_DETAILS } from '../../../../shared/constants/contact.constants';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, MapComponent, InquiryFormComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  contact = CONTACT_DETAILS;
}