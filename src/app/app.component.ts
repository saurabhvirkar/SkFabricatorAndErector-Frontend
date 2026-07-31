import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { PageImageService } from './core/services/page-image.service';
import { RouteLoadingService } from './core/services/route-loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly pageImageService = inject(PageImageService);
  readonly routeLoadingService = inject(RouteLoadingService);

  isAdminRoute = signal<boolean>(false);
  currentUrl = signal<string>('');

  ngOnInit(): void {
    // Warm the page image slots cache on application startup
    this.pageImageService.loadAllSlots().subscribe();

    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const targetUrl = event.urlAfterRedirects || event.url;
        this.checkRoute(targetUrl);
      });
  }

  private checkRoute(url: string): void {
    this.currentUrl.set(url);
    const cleanUrl = url.toLowerCase();
    const isHidden = cleanUrl.includes('/login') || cleanUrl.includes('/ops') || cleanUrl.includes('/admin');
    this.isAdminRoute.set(isHidden);
  }
}
