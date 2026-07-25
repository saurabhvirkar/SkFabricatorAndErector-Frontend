import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface NavItem {
  label: string;
  link: string;
  class?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoggedIn$ = this.authService.isLoggedIn$;
  currentUserRole$ = this.authService.currentUserRole$;
  isMenuOpen = false;
  isScrolled = false;

  baseNavItems: NavItem[] = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Our Services', link: '/our-services' },
    { label: 'Projects', link: '/projects' },
    { label: 'Clients', link: '/clients' },
    { label: 'Team', link: '/team' },
    { label: 'Gallery', link: '/gallery' },
    { label: 'Contact Us', link: '/contact-us' },
  ];

  adminNavItem: NavItem = { label: 'Inquiries', link: '/inquiries' };

  navItems$ = combineLatest([
    this.authService.isLoggedIn$,
    this.authService.currentUserRole$
  ]).pipe(
    map(([isLoggedIn, role]) => {
      const roleLower = role?.toLowerCase();
      const isAdminOrManager = roleLower === 'admin' || roleLower === 'manager';
      return isLoggedIn && isAdminOrManager ? [...this.baseNavItems, this.adminNavItem] : this.baseNavItems;
    })
  );

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const verticalOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = verticalOffset > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isMenuOpen = false;
  }
}