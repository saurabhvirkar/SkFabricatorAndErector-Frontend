import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { COMPANY_DETAILS, CORE_SERVICES } from '../../../app/core/data/company-content';
import { CompanyPdfService } from '../../../app/core/services/company-pdf.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private readonly pdfService = inject(CompanyPdfService);
  currentYear = new Date().getFullYear();
  company = COMPANY_DETAILS;
  services = CORE_SERVICES;

  downloadPdf(): void {
    this.pdfService.downloadPdf();
  }
}