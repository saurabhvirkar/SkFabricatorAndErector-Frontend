import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CORE_SERVICES, COMPANY_DETAILS } from '../../../app/core/data/company-content';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
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
    { label: 'Clients', link: '/clients' },
    { label: 'Contact Us', link: '/contact-us' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollPos > 80);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.isMenuOpen.set(false);
    this.isMegaMenuOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  openMegaMenu(): void {
    this.isMegaMenuOpen.set(true);
  }

  closeMegaMenu(): void {
    this.isMegaMenuOpen.set(false);
  }
}