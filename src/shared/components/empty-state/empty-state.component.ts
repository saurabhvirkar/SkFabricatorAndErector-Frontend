import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-12 px-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">{{ icon || 'inbox' }}</span>
      <h3 class="text-base font-bold text-slate-800">{{ title || 'No items found' }}</h3>
      <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{{ description || 'There is no information to display right now.' }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon?: string;
  @Input() title?: string;
  @Input() description?: string;
}
