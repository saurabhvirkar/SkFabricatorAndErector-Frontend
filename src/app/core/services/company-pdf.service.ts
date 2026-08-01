import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { environment } from '../../../../environments/environment';

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

  get pdfDownloadUrl(): string {
    const baseApi = environment.apiUrl.endsWith('/')
      ? environment.apiUrl.slice(0, -1)
      : environment.apiUrl;
    return `${baseApi}/company-profile/download-pdf`;
  }

  get fallbackAssetPdfUrl(): string {
    return 'assets/pdf/sk-company-profile.pdf';
  }

  downloadPdf(): void {
    // Append timestamp cache-buster so newly uploaded files are downloaded immediately without stale browser cache
    const cacheBuster = `t=${Date.now()}`;
    const directUrl = `${this.pdfDownloadUrl}?${cacheBuster}`;

    const a = document.createElement('a');
    a.href = directUrl;
    a.download = 'SK-Fabricator-Company-Profile.pdf';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

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
