import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-x-2 text-slate-900 font-bold">
      <span class="material-symbols-outlined text-amber-600" [class.text-red-600]="data.isDanger">warning</span>
      {{ data.title }}
    </h2>
    <mat-dialog-content class="py-3 text-slate-600">
      <p class="text-sm">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="gap-x-2 pt-2">
      <button mat-button (click)="onCancel()">{{ data.cancelText || 'Cancel' }}</button>
      <button mat-raised-button [color]="data.isDanger ? 'warn' : 'primary'" (click)="onConfirm()">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
