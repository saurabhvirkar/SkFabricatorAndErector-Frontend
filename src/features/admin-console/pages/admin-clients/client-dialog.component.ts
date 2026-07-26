import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { ClientDetails } from '../../../clients/models/client-details.model';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.scss']
})
export class ClientDialogComponent {
  public activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);

  @Input() client?: ClientDetails;

  isEdit = false;
  isSubmitting = signal(false);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    clientUrl: ['']
  });

  ngOnInit(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);

    if (this.client) {
      this.isEdit = true;
      this.form.patchValue({
        name: this.client.name,
        clientUrl: this.client.clientUrl || ''
      });
      if (this.client.imageUrl) {
        this.previewUrl.set(this.client.imageUrl);
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
    } else if (this.client?.imageUrl) {
      this.previewUrl.set(this.client.imageUrl);
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
    formData.append('ClientUrl', this.form.value.clientUrl ?? '');

    if (this.selectedFile) {
      formData.append('File', this.selectedFile);
    }

    this.activeModal.close(formData);
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
