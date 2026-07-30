import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit {
  private el = inject(ElementRef);

  @Input('appCountUp') targetValue: number = 0;
  @Input() duration: number = 2000;
  @Input() suffix: string = '';

  private hasAnimated = false;

  ngOnInit() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.updateText(this.targetValue);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animate();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.el.nativeElement);
  }

  private animate() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.updateText(this.targetValue);
      return;
    }

    const startTime = performance.now();
    const startVal = 0;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const currentVal = Math.floor(startVal + (this.targetValue - startVal) * easedProgress);

      this.updateText(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.updateText(this.targetValue);
      }
    };

    requestAnimationFrame(step);
  }

  private updateText(value: number) {
    const formatted = value.toLocaleString();
    this.el.nativeElement.textContent = `${formatted}${this.suffix}`;
  }
}
