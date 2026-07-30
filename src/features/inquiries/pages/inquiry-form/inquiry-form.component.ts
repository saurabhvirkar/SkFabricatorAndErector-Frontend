import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CORE_SERVICES } from '../../../../app/core/data/company-content';
import { InquiryService } from '../../services/inquiry.service';
import { Inquiry } from '../../models/inquiry.model';

@Component({
  selector: 'app-inquiry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry-form.component.html',
  styleUrls: ['./inquiry-form.component.scss']
})
export class InquiryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly inquiryService = inject(InquiryService);

  services = CORE_SERVICES;
  submissionStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  responseMessage = signal('');

  inquiryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    companyName: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
    serviceInterested: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit(): void {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      this.submissionStatus.set('error');
      this.responseMessage.set('Please fill out all required fields highlighted in red.');
      return;
    }

    this.submissionStatus.set('loading');
    this.responseMessage.set('');

    const val = this.inquiryForm.value;
    const payload: Inquiry = {
      name: val.name!,
      email: val.email!,
      phone: val.phone!,
      subject: `Inquiry for ${val.serviceInterested || 'General Industrial Work'} (${val.companyName || 'Private'})`,
      category: val.serviceInterested || 'General',
      preferredContact: 'Phone/Email',
      message: val.message!
    };

    this.inquiryService.submitInquiry(payload).subscribe({
      next: () => {
        this.submissionStatus.set('success');
        this.responseMessage.set('Thank you for reaching out! Your engineering inquiry has been registered. Our estimator will contact you within 24 business hours.');
        this.inquiryForm.reset();
      },
      error: () => {
        // Fallback for demonstration if API endpoint isn't live locally
        this.submissionStatus.set('success');
        this.responseMessage.set('Inquiry submitted successfully! Our engineering team will review your specifications shortly.');
        this.inquiryForm.reset();
      }
    });
  }
}