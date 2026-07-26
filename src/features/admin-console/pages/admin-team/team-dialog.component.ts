import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { TeamMember } from '../../../team/models/team-member.model';

@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.scss']
})
export class TeamDialogComponent {
  public activeModal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);

  @Input() member?: TeamMember;

  isEdit = false;
  isSubmitting = signal(false);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', Validators.required],
    email: ['', [Validators.email]],
    details: [''],
    linkedInUrl: ['']
  });

  ngOnInit(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);

    if (this.member) {
      this.isEdit = true;
      this.form.patchValue({
        name: this.member.name,
        role: this.member.role,
        email: this.member.email || '',
        details: this.member.details || '',
        linkedInUrl: this.member.linkedInUrl || ''
      });
      if (this.member.imageUrl) {
        this.previewUrl.set(this.member.imageUrl);
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
    } else if (this.member?.imageUrl) {
      this.previewUrl.set(this.member.imageUrl);
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
    formData.append('Role', this.form.value.role ?? '');
    formData.append('Email', this.form.value.email ?? '');
    formData.append('Details', this.form.value.details ?? '');
    formData.append('LinkedInUrl', this.form.value.linkedInUrl ?? '');

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.activeModal.close(formData);
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
