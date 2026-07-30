import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';

export interface PdfInfo {
  exists: boolean;
  fileName: string;
  fileSizeBytes: number;
  fileSizeMb: number;
  updatedAtUtc?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyPdfService {
  private readonly apiService = inject(ApiClientService);
  pdfInfo = signal<PdfInfo | null>(null);

  getPdfInfo(): Observable<PdfInfo> {
    return this.apiService.get<PdfInfo>('company-profile/pdf-info').pipe(
      tap(info => this.pdfInfo.set(info)),
      catchError(() => {
        const fallback: PdfInfo = {
          exists: true,
          fileName: 'SK-Fabricator-Company-Profile.pdf',
          fileSizeBytes: 2559076,
          fileSizeMb: 2.44
        };
        this.pdfInfo.set(fallback);
        return of(fallback);
      })
    );
  }

  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post<any>('company-profile/upload-pdf', formData, true).pipe(
      tap(() => this.getPdfInfo().subscribe())
    );
  }

  deletePdf(): Observable<any> {
    return this.apiService.delete<any>('company-profile/delete-pdf').pipe(
      tap(() => this.getPdfInfo().subscribe())
    );
  }
}
