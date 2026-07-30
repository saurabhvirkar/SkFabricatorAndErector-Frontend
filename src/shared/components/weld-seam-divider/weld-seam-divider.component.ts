import { Component, ElementRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weld-seam-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full py-6 overflow-hidden flex items-center justify-center">
      <div class="w-full max-w-7xl px-4 flex items-center justify-center">
        <div class="relative w-full h-[2px] bg-slate-300/40 rounded-full">
          <!-- Animated drawing line -->
          <div
            class="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#0B4C8C] to-[#F5A623] transition-all duration-1000 ease-out"
            [style.width]="isVisible() ? '100%' : '0%'"
          >
            <!-- Glowing Weld Spark Tip -->
            <div
              *ngIf="isVisible()"
              class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F5A623] shadow-[0_0_12px_#F5A623,0_0_24px_#E8871E] animate-spark-glow"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class WeldSeamDividerComponent implements OnInit {
  private el = inject(ElementRef);
  isVisible = signal<boolean>(false);

  ngOnInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible.set(true);
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(this.el.nativeElement);
    } else {
      this.isVisible.set(true);
    }
  }
}
