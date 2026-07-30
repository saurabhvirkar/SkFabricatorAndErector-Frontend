import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CLIENT_LOGOS, ClientItem } from '../../../app/core/data/company-content';
import { ClientService } from '../../../features/clients/services/client.service';

@Component({
  selector: 'app-scrolling-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrolling-clients.component.html',
  styleUrls: ['./scrolling-clients.component.scss']
})
export class ScrollingClientsComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  clients = signal<ClientItem[]>(CLIENT_LOGOS);

  ngOnInit(): void {
    this.clientService.getClientDetails().subscribe({
      next: (apiClients) => {
        if (apiClients && apiClients.length > 0) {
          const mapped: ClientItem[] = apiClients.map(c => ({
            id: String(c.id),
            name: c.name,
            tagline: (c as any).tagline || c.clientUrl || undefined,
            category: (c as any).category || 'Industrial Partner'
          }));
          this.clients.set(mapped);
        }
      },
      error: () => {}
    });
  }
}
