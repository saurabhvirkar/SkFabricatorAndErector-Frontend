import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { ClientDetails } from '../../models/client-details.model';
import { ClientService } from '../../services/client.service';

@Component({
  standalone: true,
  selector: 'app-clients-details',
  imports: [CommonModule],
  templateUrl: './clients-details.component.html',
  styleUrls: ['./clients-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsDetailsComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  clients = signal<ClientDetails[]>([]);

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
}