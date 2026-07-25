import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeSlider } from '../models/home-slider.model';
import { ApiClientService } from '../../../core/api/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class HomeSliderService {
  private readonly apiService = inject(ApiClientService);

  getHomeSliders(): Observable<HomeSlider[]> {
    return this.apiService.get<HomeSlider[]>('homeslider');
  }

  addHomeSlider(formData: FormData): Observable<HomeSlider> {
    return this.apiService.post<HomeSlider>('homeslider', formData, true);
  }

  deleteHomeSlider(id: number): Observable<void> {
    return this.apiService.delete<void>(`homeslider/${id}`);
  }
}
