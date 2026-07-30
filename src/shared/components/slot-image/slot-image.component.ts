import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageImageService } from '../../../app/core/services/page-image.service';

@Component({
  selector: 'app-slot-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full overflow-hidden flex items-center justify-center">
      @if (slot() && slot()!.imageUrl) {
        <img
          [src]="slot()!.imageUrl"
          [alt]="alt || slot()!.altText || slot()!.label || 'SK Fabricator & Erector Image'"
          [class]="imgClass || 'w-full h-full object-cover transition-transform duration-500'"
          loading="lazy"
        />
      } @else {
        <!-- Fallback Placeholder Tag when no image has been uploaded -->
        @if (fallbackUrl) {
          <img
            [src]="fallbackUrl"
            [alt]="alt || 'Fallback Image'"
            [class]="imgClass || 'w-full h-full object-cover'"
          />
        } @else {
          <div class="photo-placeholder-tag border border-dashed border-[#F5A623]/40 bg-slate-900/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-xs text-[#F5A623]">photo_camera</span>
            <span class="text-[10px] font-display font-bold uppercase text-[#F5A623] tracking-wider">
              [PHOTO NEEDED: {{ slot() ? slot()!.label : slotKey }}]
            </span>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class SlotImageComponent implements OnInit {
  private readonly pageImageService = inject(PageImageService);

  @Input({ required: true }) slotKey!: string;
  @Input() fallbackUrl?: string;
  @Input() alt?: string;
  @Input() imgClass?: string;

  slot = this.pageImageService.getSlot('');

  ngOnInit(): void {
    if (this.slotKey) {
      this.slot = this.pageImageService.getSlot(this.slotKey);
    }
  }
}
