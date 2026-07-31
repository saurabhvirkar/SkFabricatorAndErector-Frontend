import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Inquiry } from '../models/inquiry.model';
import { ApiClientService } from '../../../core/api/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private readonly apiService = inject(ApiClientService);

  getInquiries(): Observable<Inquiry[]> {
    return this.apiService.get<Inquiry[]>('inquiry');
  }

  deleteInquiry(id: number): Observable<void> {
    return this.apiService.delete<void>(`inquiry/${id}`);
  }

  submitInquiry(inquiryData: FormData): Observable<Inquiry> {
    return this.apiService.post<Inquiry>('inquiry', inquiryData);
  }
}
