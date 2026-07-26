import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slider-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './slider-dialog.component.html',
  styleUrls: ['./slider-dialog.component.scss']
})
export class SliderDialogComponent {
  public activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);

  isSubmitting = signal(false);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);
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
    this.previewUrl.set(null);
  }

  onSubmit(): void {
    if (this.isSubmitting()) return;
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('Title', this.form.value.title ?? '');
    formData.append('Description', this.form.value.description ?? '');
    formData.append('File', this.selectedFile);

    this.activeModal.close(formData);
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
