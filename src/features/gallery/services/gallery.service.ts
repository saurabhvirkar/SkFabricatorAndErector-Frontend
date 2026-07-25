import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryImage } from '../models/gallery-image.model';
import { ApiClientService } from '../../../core/api/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private readonly apiService = inject(ApiClientService);

  getPhotos(): Observable<GalleryImage[]> {
    return this.apiService.get<GalleryImage[]>('photos');
  }

  getImages(filter: string): Observable<GalleryImage[]> {
    let url = 'photos';
    if (filter !== 'All') {
      url += `?category=${filter}`;
    }
    return this.apiService.get<GalleryImage[]>(url);
  }

  uploadImage(formData: FormData, category: string, isAboutSlider: boolean): Observable<GalleryImage> {
    formData.append('category', category);
    formData.append('isAboutSlider', isAboutSlider.toString());
    return this.apiService.post<GalleryImage>('photos', formData, true);
  }

  deleteImage(id: number): Observable<void> {
    return this.apiService.delete<void>(`photos/${id}`);
  }
}
