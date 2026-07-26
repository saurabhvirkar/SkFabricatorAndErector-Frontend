import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="modal-header border-0 pb-0">
      <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
        <mat-icon [class.text-danger]="isDanger" [class.text-warning]="!isDanger">warning</mat-icon>
        <span>{{ title }}</span>
      </h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body py-3 text-secondary">
      <p class="mb-0 small leading-relaxed">{{ message }}</p>
    </div>
    <div class="modal-footer border-top-0 pt-0 gap-2">
      <button type="button" class="btn btn-light rounded-3 px-3" (click)="onCancel()">{{ cancelText || 'Cancel' }}</button>
      <button type="button" class="btn rounded-3 px-4" [class.btn-danger]="isDanger" [class.btn-primary]="!isDanger" (click)="onConfirm()">
        {{ confirmText || 'Confirm' }}
      </button>
    </div>
  `
})
export class ConfirmationDialogComponent {
  public activeModal = inject(NgbActiveModal);

  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() isDanger = false;

  onConfirm(): void {
    this.activeModal.close(true);
  }

  onCancel(): void {
    this.activeModal.close(false);
  }
}
