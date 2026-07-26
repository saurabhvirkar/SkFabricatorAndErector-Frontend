import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../projects/models/project.model';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent {
  public activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);

  @Input() project?: Project;

  isEdit = false;
  isSubmitting = signal(false);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  categories = ['Piping', 'Fabrication', 'Erection', 'Maintenance'];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    category: ['Fabrication', Validators.required],
    description: ['']
  });

  ngOnInit(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);

    if (this.project) {
      this.isEdit = true;
      this.form.patchValue({
        title: this.project.title,
        category: this.project.category,
        description: this.project.description
      });
      if (this.project.image) {
        this.previewUrl.set(this.project.image);
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
    } else if (this.project?.image) {
      this.previewUrl.set(this.project.image);
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
    formData.append('Title', this.form.value.title ?? '');
    formData.append('Category', this.form.value.category ?? '');
    formData.append('Description', this.form.value.description ?? '');

    if (this.selectedFile) {
      formData.append('File', this.selectedFile);
    }

    this.activeModal.close(formData);
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
