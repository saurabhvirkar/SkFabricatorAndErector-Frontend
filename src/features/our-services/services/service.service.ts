import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { ApiClientService } from '../../../core/api/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly apiService = inject(ApiClientService);

  getServices(): Observable<Service[]> {
    return this.apiService.get<Service[]>('ourservices');
  }

  addService(serviceData: FormData): Observable<Service> {
    return this.apiService.post<Service>('ourservices', serviceData, true);
  }

  updateService(serviceId: number, serviceData: FormData | any): Observable<Service> {
    return this.apiService.put<Service>(`ourservices/${serviceId}`, serviceData);
  }

  deleteService(serviceId: number): Observable<void> {
    return this.apiService.delete<void>(`ourservices/${serviceId}`);
  }
}
