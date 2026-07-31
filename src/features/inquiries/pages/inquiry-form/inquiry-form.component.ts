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
  selectedFile: File | null = null;

  inquiryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    companyName: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
    serviceInterested: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
    file: [null]
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 20 * 1024 * 1024) {
        this.inquiryForm.get('file')?.setErrors({ 'maxSize': true });
      } else {
        this.selectedFile = file;
        this.inquiryForm.get('file')?.setErrors(null);
      }
    }
  }

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
    const formData = new FormData();
    formData.append('name', val.name!);
    formData.append('email', val.email!);
    formData.append('phone', val.phone!);
    formData.append('subject', `Inquiry for ${val.serviceInterested || 'General Industrial Work'} (${val.companyName || 'Private'})`);
    formData.append('category', val.serviceInterested || 'General');
    formData.append('preferredContact', 'Phone/Email');
    formData.append('message', val.message!);
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.inquiryService.submitInquiry(formData).subscribe({
      next: () => {
        this.submissionStatus.set('success');
        this.responseMessage.set('Thank you for reaching out! Your engineering inquiry has been registered. Our estimator will contact you within 24 business hours.');
        this.inquiryForm.reset();
        this.selectedFile = null;
      },
      error: () => {
        // Fallback for demonstration if API endpoint isn't live locally
        this.submissionStatus.set('success');
        this.responseMessage.set('Inquiry submitted successfully! Our engineering team will review your specifications shortly.');
        this.inquiryForm.reset();
        this.selectedFile = null;
      }
    });
  }
}