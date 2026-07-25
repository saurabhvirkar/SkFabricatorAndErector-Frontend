import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InquiryService } from '../../services/inquiry.service';
import { Inquiry } from '../../models/inquiry.model';

@Component({
  selector: 'app-inquiry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry-form.component.html',
  styleUrls: ['./inquiry-form.component.scss'],
})
export class InquiryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly inquiryService = inject(InquiryService); 

  submissionStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  responseMessage = signal('');

  inquiryForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: [''],
    category: [''],
    preferredContact: ['Email'],
    message: ['', Validators.required],
  });

  onSubmit() {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      this.responseMessage.set('Please fill out all required fields correctly (Name, Email, Message).');
      this.submissionStatus.set('error');
      return;
    }

    this.submissionStatus.set('loading');
    this.responseMessage.set('');

    const formValue = this.inquiryForm.value;
    const inquiryData: Inquiry = {
      name: formValue.name!,
      email: formValue.email!,
      phone: formValue.phone || '',
      subject: formValue.subject || '',
      category: formValue.category || '',
      preferredContact: formValue.preferredContact || '',
      message: formValue.message!,
    };

    this.inquiryService.submitInquiry(inquiryData).subscribe({
      next: () => {
        this.submissionStatus.set('success');
        this.responseMessage.set('Your inquiry has been sent successfully! We will get back to you shortly.');
        this.inquiryForm.reset({
          category: '',
          preferredContact: 'Email'
        });
      },
      error: (err) => {
        this.submissionStatus.set('error');
        this.responseMessage.set(err.message || 'An unexpected error occurred. Please try again.');
        console.error('Inquiry Submission Error:', err);
      }
    });
  }
}