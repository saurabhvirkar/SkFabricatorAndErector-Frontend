import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-photo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './photo-dialog.component.html',
  styleUrls: ['./photo-dialog.component.scss']
})
export class PhotoDialogComponent {
  public activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);

  isSubmitting = signal(false);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  categories = ['Piping', 'Fabrication', 'Erection', 'Maintenance'];

  form = this.fb.group({
    category: ['Fabrication', Validators.required],
    isAboutSlider: [false]
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
    if (!this.selectedFile || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('File', this.selectedFile);
    formData.append('Category', this.form.value.category ?? 'Fabrication');
    formData.append('IsAboutSlider', (!!this.form.value.isAboutSlider).toString());

    this.activeModal.close({
      formData,
      category: this.form.value.category ?? 'Fabrication',
      isAboutSlider: !!this.form.value.isAboutSlider
    });
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
