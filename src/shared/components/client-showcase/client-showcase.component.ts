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

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'assets/images/placeholder.jpg';
    }
  }
}
