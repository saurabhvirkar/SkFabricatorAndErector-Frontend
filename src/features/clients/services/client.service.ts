import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientDetails } from '../models/client-details.model';
import { ApiClientService } from '../../../core/api/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly apiService = inject(ApiClientService);

  getClientDetails(): Observable<ClientDetails[]> {
    return this.apiService.get<ClientDetails[]>('clientdetails');
  }

  addClient(clientData: FormData): Observable<ClientDetails> {
    return this.apiService.post<ClientDetails>('clientdetails', clientData, true);
  }

  deleteClient(id: number): Observable<void> {
    return this.apiService.delete<void>(`clientdetails/${id}`);
  }

  updateClient(id: number, clientData: ClientDetails): Observable<ClientDetails> {
    return this.apiService.put<ClientDetails>(`clientdetails/${id}`, clientData);
  }
}
