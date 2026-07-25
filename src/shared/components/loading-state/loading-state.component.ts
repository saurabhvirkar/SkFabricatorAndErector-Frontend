import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 space-y-3">
      <div class="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-slate-600 font-medium text-sm">{{ message || 'Loading data...' }}</p>
    </div>
  `
})
export class LoadingStateComponent {
  @Input() message?: string;
}
