import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  private el = inject(ElementRef);

  @Input() delayMs: number = 0;

  ngOnInit() {
    const nativeEl = this.el.nativeElement as HTMLElement;
    nativeEl.style.opacity = '0';
    nativeEl.style.transform = 'translateY(24px)';
    nativeEl.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${this.delayMs}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${this.delayMs}ms`;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      nativeEl.style.opacity = '1';
      nativeEl.style.transform = 'translateY(0)';
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nativeEl.style.opacity = '1';
          nativeEl.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(nativeEl);
  }
}
