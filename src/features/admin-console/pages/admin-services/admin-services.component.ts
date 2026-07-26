import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ServiceService } from '../../../our-services/services/service.service';
import { Service } from '../../../our-services/models/service.model';
import { ServiceDialogComponent } from './service-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { AdminPaginatorComponent } from '../../components/admin-paginator/admin-paginator.component';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    MatSnackBarModule,
    MatIconModule,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    AdminPageHeaderComponent,
    AdminPaginatorComponent
  ],
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.scss']
})
export class AdminServicesComponent implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly modalService = inject(NgbModal);
  private readonly snackBar = inject(MatSnackBar);

  services = signal<Service[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  filterText = signal('');
  sortColumn = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  page = signal(1);
  pageSize = signal(10);

  filteredServices = computed(() => {
    let result = [...this.services()];
    const query = this.filterText().trim().toLowerCase();

    if (query) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        (s.summary && s.summary.toLowerCase().includes(query)) ||
        (s.description && s.description.toLowerCase().includes(query))
      );
    }

    const col = this.sortColumn();
    const dir = this.sortDirection();

    if (col) {
      result.sort((a, b) => {
        let valA = (a as any)[col] ?? '';
        let valB = (b as any)[col] ?? '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  paginatedServices = computed(() => {
    const list = this.filteredServices();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
    this.page.set(1);
  }

  openAddDialog(): void {
    const modalRef = this.modalService.open(ServiceDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.serviceService.addService(formData).subscribe({
          next: () => {
            this.snackBar.open('Service created successfully', 'Close', { duration: 3000 });
            this.loadServices();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to create service', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  openEditDialog(service: Service): void {
    const modalRef = this.modalService.open(ServiceDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.service = service;

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.serviceService.updateService(service.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Service updated successfully', 'Close', { duration: 3000 });
            this.loadServices();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to update service', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  deleteService(service: Service): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.title = 'Delete Service';
    modalRef.componentInstance.message = `Are you sure you want to delete "${service.name}"? This operation cannot be undone.`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.isDanger = true;

    modalRef.result.then((confirmed: boolean) => {
      if (confirmed) {
        this.serviceService.deleteService(service.id).subscribe({
          next: () => {
            this.snackBar.open('Service deleted successfully', 'Close', { duration: 3000 });
            this.loadServices();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to delete service', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }
}
