import { Component, inject, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class OurServicesComponent implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoggedIn = toSignal(this.authService.isLoggedIn$, { initialValue: false });
  currentUserRole = toSignal(this.authService.currentUserRole$, { initialValue: null });

  isAdminOrManager = computed(() => {
    const role = this.currentUserRole()?.toLowerCase();
    return role === 'admin' || role === 'manager';
  });

  services = signal<Service[]>([]);
  showAddServiceForm = signal<boolean>(false);
  editingService = signal<Service | null>(null);

  newService: Service = { id: 0, name: '', summary: '', description: '', imageUrl: '' };

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

  toggleAddServiceForm(): void {
    this.showAddServiceForm.update(value => !value);
  }

  toggleEditServiceForm(service: Service | null): void {
    this.editingService.set(service);
  }

  onAddService(form: NgForm, files: FileList | null): void {
    if (form.valid && files && files.length > 0) {
      const formData = new FormData();
      formData.append('Name', form.value.name);
      formData.append('Summary', form.value.summary);
      formData.append('Description', form.value.description);
      formData.append('File', files[0]);

      this.serviceService.addService(formData).subscribe({
        next: (service) => {
          this.services.update(services => [...services, service]);
          this.toggleAddServiceForm();
          form.resetForm();
        },
        error: (err) => {
          console.error('Failed to add service', err);
        }
      });
    }
  }

  onUpdateService(form: NgForm, service: Service): void {
    if (form.valid) {
      const updatedServiceData = {
        id: service.id,
        name: form.value.name,
        summary: form.value.summary,
        description: form.value.description,
        imageUrl: service.imageUrl
      };
      this.serviceService.updateService(service.id, updatedServiceData).subscribe({
        next: (updatedService) => {
          this.services.update(services => {
            const index = services.findIndex(s => s.id === updatedService.id);
            if (index !== -1) {
              services[index] = updatedService;
            }
            return [...services];
          });
          this.toggleEditServiceForm(null);
        },
        error: (err) => {
          console.error('Failed to update service', err);
        }
      });
    }
  }

  onImageUpload(serviceId: number, files: FileList | null): void {
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('File', files[0]);
      formData.append('ServiceId', serviceId.toString());
      this.serviceService.addService(formData).subscribe({
        next: () => this.loadServices(),
        error: (err) => console.error('Failed to upload image', err)
      });
    }
  }

  deleteService(serviceId: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.serviceService.deleteService(serviceId).subscribe({
        next: () => {
          this.services.update(services => services.filter(s => s.id !== serviceId));
        },
        error: (err) => {
          console.error('Failed to delete service', err);
        }
      });
    }
  }

  navigateToContactUs(): void {
    this.router.navigate(['/contact-us']);
  }
}