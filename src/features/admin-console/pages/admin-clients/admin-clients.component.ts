import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../../clients/services/client.service';
import { ClientDetails } from '../../../clients/models/client-details.model';
import { ClientDialogComponent } from './client-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { AdminPaginatorComponent } from '../../components/admin-paginator/admin-paginator.component';

@Component({
  selector: 'app-admin-clients',
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
  templateUrl: './admin-clients.component.html',
  styleUrls: ['./admin-clients.component.scss']
})
export class AdminClientsComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly modalService = inject(NgbModal);
  private readonly snackBar = inject(MatSnackBar);

  clients = signal<ClientDetails[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  filterText = signal('');
  sortColumn = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  page = signal(1);
  pageSize = signal(10);

  filteredClients = computed(() => {
    let result = [...this.clients()];
    const query = this.filterText().trim().toLowerCase();

    if (query) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        (c.clientUrl && c.clientUrl.toLowerCase().includes(query))
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

  paginatedClients = computed(() => {
    const list = this.filteredClients();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.clientService.getClientDetails().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
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
    const modalRef = this.modalService.open(ClientDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.clientService.addClient(formData).subscribe({
          next: () => {
            this.snackBar.open('Client partner created successfully', 'Close', { duration: 3000 });
            this.loadClients();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to create client', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  openEditDialog(client: ClientDetails): void {
    const modalRef = this.modalService.open(ClientDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.client = client;

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.clientService.updateClient(client.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Client partner updated successfully', 'Close', { duration: 3000 });
            this.loadClients();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to update client', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  deleteClient(client: ClientDetails): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.title = 'Delete Client Partner';
    modalRef.componentInstance.message = `Are you sure you want to delete "${client.name}"? This operation cannot be undone.`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.isDanger = true;

    modalRef.result.then((confirmed: boolean) => {
      if (confirmed) {
        this.clientService.deleteClient(client.id).subscribe({
          next: () => {
            this.snackBar.open('Client partner deleted successfully', 'Close', { duration: 3000 });
            this.loadClients();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to delete client', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }
}
