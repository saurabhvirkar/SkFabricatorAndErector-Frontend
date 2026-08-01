import { Component, HostListener, signal, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { CORE_SERVICES, COMPANY_DETAILS } from '../../../app/core/data/company-content';

import { CompanyPdfService } from '../../../app/core/services/company-pdf.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  readonly pdfService = inject(CompanyPdfService);
  private readonly destroy$ = new Subject<void>();

  downloadPdf(): void {
    this.pdfService.downloadPdf();
  }

  @ViewChild('desktopNavContainer') desktopNavContainer?: ElementRef<HTMLElement>;
  @ViewChild('mobileNavContainer') mobileNavContainer?: ElementRef<HTMLElement>;

  desktopIndicatorTransform = signal<string>('translateX(0px)');
  desktopIndicatorWidth = signal<number>(0);
  desktopIndicatorOpacity = signal<number>(0);

  mobileIndicatorTransform = signal<string>('translateY(0px)');
  mobileIndicatorHeight = signal<number>(0);
  mobileIndicatorOpacity = signal<number>(0);

  isMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);
  isMegaMenuOpen = signal<boolean>(false);

  company = COMPANY_DETAILS;
  services = CORE_SERVICES;

  navItems = [
    { label: 'Home', link: '/' },
    { label: 'About Us', link: '/about' },
    { label: 'Solutions', link: '/our-services', hasDropdown: true },
    { label: 'Projects', link: '/projects' },
    { label: 'Contact Us', link: '/contact-us' }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => this.updateIndicators(), 50);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeAllMenus();
        setTimeout(() => this.updateIndicators(), 50);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.updateIndicators();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollPos > 80);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeAllMenus();
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
    this.isMegaMenuOpen.set(false);
    if (this.isMenuOpen()) {
      setTimeout(() => this.updateMobileIndicator(), 50);
    }
  }

  openMegaMenu(): void {
    this.isMegaMenuOpen.set(true);
  }

  closeMegaMenu(): void {
    this.isMegaMenuOpen.set(false);
  }

  closeAllMenus(): void {
    this.isMenuOpen.set(false);
    this.isMegaMenuOpen.set(false);
  }

  updateIndicators(): void {
    this.updateDesktopIndicator();
    this.updateMobileIndicator();
  }

  updateDesktopIndicator(): void {
    if (!this.desktopNavContainer) return;
    const containerEl = this.desktopNavContainer.nativeElement;
    const activeEl = containerEl.querySelector('.active-nav-link') as HTMLElement;
    if (activeEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const left = activeRect.left - containerRect.left;
      this.desktopIndicatorWidth.set(activeRect.width);
      this.desktopIndicatorTransform.set(`translateX(${left}px)`);
      this.desktopIndicatorOpacity.set(1);
    } else {
      this.desktopIndicatorOpacity.set(0);
    }
  }

  updateMobileIndicator(): void {
    if (!this.mobileNavContainer) return;
    const containerEl = this.mobileNavContainer.nativeElement;
    const activeEl = containerEl.querySelector('.active-mobile-link') as HTMLElement;
    if (activeEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const top = activeRect.top - containerRect.top;
      this.mobileIndicatorHeight.set(activeRect.height);
      this.mobileIndicatorTransform.set(`translateY(${top}px)`);
      this.mobileIndicatorOpacity.set(1);
    } else {
      this.mobileIndicatorOpacity.set(0);
    }
  }
}