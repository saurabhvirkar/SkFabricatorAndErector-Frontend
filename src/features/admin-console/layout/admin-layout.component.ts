import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/auth/auth.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    LogoComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);

  isMobileNavOpen = signal(false);
  userRole = signal<string | null>(null);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/ops/adminportal/dashboard' },
    { label: 'Change Password', icon: 'lock_reset', route: '/ops/adminportal/change-password' },
    { label: 'Projects', icon: 'apartment', route: '/ops/adminportal/projects' },
    { label: 'Our Services', icon: 'design_services', route: '/ops/adminportal/services' },
    { label: 'Team Members', icon: 'groups', route: '/ops/adminportal/team' },
    { label: 'Gallery / Photos', icon: 'photo_library', route: '/ops/adminportal/gallery' },
    { label: 'Page Photo Manager', icon: 'collections', route: '/ops/adminportal/photos' },
    { label: 'Clients', icon: 'business_center', route: '/ops/adminportal/clients' },
    { label: 'Home Sliders', icon: 'view_carousel', route: '/ops/adminportal/sliders' },
    { label: 'Inquiries', icon: 'mail', route: '/ops/adminportal/inquiries' },
    { label: 'Admin Session', icon: 'person', route: '/ops/adminportal/users' }
  ];

  constructor() {
    this.authService.currentUserRole$.subscribe(role => {
      this.userRole.set(role);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
