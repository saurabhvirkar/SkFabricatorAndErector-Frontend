import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../features/clients/services/client.service';
import { ClientDetails } from '../../../features/clients/models/client-details.model';

@Component({
  selector: 'app-client-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-showcase.component.html',
  styleUrls: ['./client-showcase.component.scss']
})
export class ClientShowcaseComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  clients = signal<ClientDetails[]>([]);
  isLoading = signal<boolean>(true);
  failedImages = signal<Set<number>>(new Set<number>());

  // Duplicated client list for seamless infinite loop scroll without jumps
  displayClients = computed(() => {
    const list = this.clients();
    if (list.length === 0) return [];
    return list.length < 5 ? [...list, ...list, ...list, ...list] : [...list, ...list];
  });

  ngOnInit(): void {
    this.clientService.getClientDetails().subscribe({
      next: (data) => {
        this.clients.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.warn('Client showcase error:', err);
        this.clients.set([]);
        this.isLoading.set(false);
      }
    });
  }

  handleImageError(clientId: number): void {
    if (!clientId) return;
    this.failedImages.update((set) => {
      const newSet = new Set(set);
      newSet.add(clientId);
      return newSet;
    });
  }

  getInitials(name: string): string {
    if (!name) return 'CL';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
