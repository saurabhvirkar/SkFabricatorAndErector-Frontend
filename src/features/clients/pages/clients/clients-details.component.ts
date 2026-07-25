import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { ClientDetails } from '../../models/client-details.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  standalone: true,
  selector: 'app-clients-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-details.component.html',
  styleUrls: ['./clients-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsDetailsComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly authService = inject(AuthService);

  clients = signal<ClientDetails[]>([]);
  showAddClientForm = signal<boolean>(false);
  editClient = signal<ClientDetails | null>(null);
  isEditing = computed(() => this.editClient() !== null);
  newClient: ClientDetails = { id: 0, name: '', imageUrl: '', clientUrl: '' };
  isLoggedIn = toSignal(this.authService.isLoggedIn$, { initialValue: false });
  currentUserRole = toSignal(this.authService.currentUserRole$, { initialValue: null });

  isAdminOrManager = computed(() => {
    const role = this.currentUserRole()?.toLowerCase();
    return role === 'admin' || role === 'manager';
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClientDetails().subscribe({
      next: (clients: ClientDetails[]) => {
        this.clients.set(clients);
      },
      error: (err: unknown) => {
        console.error('Failed to load clients', err);
      }
    });
  }

  toggleAddClientForm(): void {
    this.showAddClientForm.update(value => !value);
    if (!this.showAddClientForm()) {
      this.newClient = { id: 0, name: '', imageUrl: '', clientUrl: '' };
    }
  }

  onAddClient(form: NgForm, files: FileList | null): void {
    if (form.valid && files && files.length > 0) {
      const formData = new FormData();
      formData.append('name', this.newClient.name);
      formData.append('clientUrl', this.newClient.clientUrl || '');
      formData.append('file', files[0]);

      this.clientService.addClient(formData).subscribe({
        next: (client) => {
          this.clients.update(clients => [...clients, client]);
          this.toggleAddClientForm();
          form.resetForm();
        },
        error: (err: unknown) => {
          console.error('Failed to add client', err);
        }
      });
    }
  }

  startEdit(client: ClientDetails): void {
    this.editClient.set({ ...client });
  }

  cancelEdit(): void {
    this.editClient.set(null);
  }

  onUpdateClient(): void {
    const clientToUpdate = this.editClient();
    if (clientToUpdate && clientToUpdate.id) {
      const updateDto = { ...clientToUpdate };

      this.clientService.updateClient(clientToUpdate.id, updateDto).subscribe({
        next: (updatedClient) => {
          this.clients.update(clients =>
            clients.map(c => (c.id === updatedClient.id ? updatedClient : c))
          );
          this.cancelEdit();
        },
        error: (err: unknown) => {
          console.error('Failed to update client', err);
        }
      });
    }
  }

  onDeleteClient(id: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.clients.update(clients => clients.filter(c => c.id !== id));
        },
        error: (err: unknown) => {
          console.error('Failed to delete client', err);
        }
      });
    }
  }

  onImageUpload(clientId: number, files: FileList | null): void {
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('clientId', clientId.toString());
      this.clientService.addClient(formData).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error('Failed to upload client image', err)
      });
    }
  }
}