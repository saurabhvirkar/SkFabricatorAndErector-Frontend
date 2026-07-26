import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { Service } from '../../../our-services/models/service.model';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.scss']
})
export class ServiceDialogComponent {
  public activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);

  @Input() service?: Service;

  isEdit = false;
  isSubmitting = signal(false);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    summary: [''],
    description: ['']
  });

  ngOnInit(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);

    if (this.service) {
      this.isEdit = true;
      this.form.patchValue({
        name: this.service.name,
        summary: this.service.summary || '',
        description: this.service.description || ''
      });
      if (this.service.imageUrl) {
        this.previewUrl.set(this.service.imageUrl);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    if (!this.isEdit) {
      this.previewUrl.set(null);
    } else if (this.service?.imageUrl) {
      this.previewUrl.set(this.service.imageUrl);
    } else {
      this.previewUrl.set(null);
    }
  }

  onSubmit(): void {
    if (this.isSubmitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('Name', this.form.value.name ?? '');
    formData.append('Summary', this.form.value.summary ?? '');
    formData.append('Description', this.form.value.description ?? '');

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.activeModal.close(formData);
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
