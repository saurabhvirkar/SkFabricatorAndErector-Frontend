import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-12 px-4 bg-red-50 rounded-xl border border-red-200">
      <span class="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
      <h3 class="text-base font-bold text-red-900">{{ title || 'Failed to load content' }}</h3>
      <p class="text-xs text-red-700 mt-1 max-w-sm mx-auto">{{ description || 'An unexpected error occurred. Please try again.' }}</p>
      @if (showRetry) {
        <button (click)="retry.emit()" class="mt-4 px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
          Retry Request
        </button>
      }
    </div>
  `
})
export class ErrorStateComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
