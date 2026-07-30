import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';

export interface PageImageSlotDto {
  id: number;
  slotKey: string;
  pageName: string;
  sectionName: string;
  label: string;
  imageUrl?: string;
  altText?: string;
  updatedAtUtc?: string;
  hasImage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PageImageService {
  private readonly apiService = inject(ApiClientService);

  private slotsMap = signal<Record<string, PageImageSlotDto>>({});

  loadAllSlots(): Observable<PageImageSlotDto[]> {
    return this.apiService.get<PageImageSlotDto[]>('page-images').pipe(
      tap((slots: PageImageSlotDto[]) => {
        const map: Record<string, PageImageSlotDto> = {};
        if (Array.isArray(slots)) {
          for (const s of slots) {
            if (s && s.slotKey) {
              map[s.slotKey.toLowerCase()] = s;
            }
          }
        }
        this.slotsMap.set(map);
      }),
      catchError(err => {
        console.warn('PageImageService: Failed to load slots from API, using fallback layout tags.', err);
        return of([]);
      })
    );
  }

  getSlot(slotKey: string) {
    return computed(() => {
      const key = slotKey.toLowerCase();
      return this.slotsMap()[key] || null;
    });
  }

  uploadSlotImage(slotKey: string, file: File, altText?: string): Observable<PageImageSlotDto> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }
    return this.apiService.post<PageImageSlotDto>(`page-images/${slotKey}`, formData, true).pipe(
      tap((updatedSlot: PageImageSlotDto) => {
        this.slotsMap.update(currentMap => ({
          ...currentMap,
          [slotKey.toLowerCase()]: updatedSlot
        }));
      })
    );
  }

  deleteSlotImage(slotKey: string): Observable<PageImageSlotDto> {
    return this.apiService.delete<PageImageSlotDto>(`page-images/${slotKey}`).pipe(
      tap((updatedSlot: PageImageSlotDto) => {
        this.slotsMap.update(currentMap => ({
          ...currentMap,
          [slotKey.toLowerCase()]: updatedSlot
        }));
      })
    );
  }
}
