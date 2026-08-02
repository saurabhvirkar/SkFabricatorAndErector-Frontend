import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LogoVariant = 'auto' | 'white' | 'color';
export type LogoSize = 'sm' | 'md' | 'lg' | 'nav' | 'custom';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="logo-container inline-flex items-center shrink-0"
      [class.logo-animated]="animated"
      [class.logo-interactive]="interactive"
      [class.logo-variant-white]="variant === 'white'"
      [class.logo-nav]="size === 'nav'"
      [class.logo-sm]="size === 'sm'"
      [class.logo-md]="size === 'md'"
      [class.logo-lg]="size === 'lg'"
      [style.height]="size === 'custom' ? customHeight : null"
    >
      <img
        [src]="logoSrc()"
        [alt]="altText"
        class="logo-img object-contain w-auto h-full transition-all duration-200"
        loading="eager"
        decoding="async"
      />
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
    }

    .logo-container {
      position: relative;
      user-select: none;
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }

    /* Size Presets */
    .logo-sm {
      height: 28px;
    }

    .logo-md {
      height: 42px;
    }

    .logo-lg {
      height: 58px;
    }

    /* Nav Preset: Prominent, larger logo size next to brand text */
    .logo-nav {
      height: clamp(52px, 6.5vw, 78px);
    }

    .logo-img {
      display: block;
      max-height: 100%;
      width: auto;
      object-fit: contain;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      background: transparent !important;
      /* Precise contour drop shadow following transparent PNG pixels, NOT a square box */
      filter: drop-shadow(0 2px 6px rgba(11, 76, 140, 0.22));
      transition: transform 200ms ease, filter 200ms ease;
    }

    /* Dark Background Variant: Add soft white contour highlight around internal PNG content */
    .logo-variant-white .logo-img {
      filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.95)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
    }

    /* Task 4 — Entrance Animation */
    .logo-animated {
      animation: logoReveal 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes logoReveal {
      0% {
        opacity: 0;
        transform: scale(0.92);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Task 4 — Hover / Tap Interactive Animation (Contour Drop Shadow Boost) */
    .logo-interactive:hover .logo-img,
    .logo-interactive:active .logo-img {
      transform: scale(1.05);
      filter: drop-shadow(0 4px 10px rgba(11, 76, 140, 0.35));
    }

    .logo-variant-white.logo-interactive:hover .logo-img {
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 1)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8));
    }

    /* Respect prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {
      .logo-animated {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .logo-interactive:hover .logo-img,
      .logo-interactive:active .logo-img {
        transform: none !important;
        transition: none !important;
      }
    }
  `]
})
export class LogoComponent {
  @Input() set variant(val: LogoVariant) {
    this._variant.set(val);
  }
  get variant(): LogoVariant {
    return this._variant();
  }

  @Input() size: LogoSize = 'md';
  @Input() customHeight: string = '42px';
  @Input() altText: string = 'SK Fabricator & Erector Logo';
  @Input() animated: boolean = true;
  @Input() interactive: boolean = true;

  private _variant = signal<LogoVariant>('color');

  logoSrc = computed(() => {
    // Uses transparent PNG logo asset
    return '/Sk_White_logo.png';
  });
}
