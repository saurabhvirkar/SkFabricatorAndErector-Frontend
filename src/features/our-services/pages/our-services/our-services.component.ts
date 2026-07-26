import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurServicesComponent implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly router = inject(Router);

  services = signal<Service[]>([]);

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services.set(services);
      },
      error: (err) => {
        console.error('Failed to load services', err);
      }
    });
  }

  navigateToContactUs(): void {
    this.router.navigate(['/contact-us']);
  }
}