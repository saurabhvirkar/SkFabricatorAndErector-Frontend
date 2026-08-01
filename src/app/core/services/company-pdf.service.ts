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
    const downloadUrl = this.pdfDownloadUrl;

    fetch(downloadUrl, { method: 'GET' })
      .then((res) => {
        if (res.ok) {
          return res.blob();
        }
        throw new Error('API PDF not available');
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SK-Fabricator-Company-Profile.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        // Seamless fallback to bundled local PDF asset if server endpoint returns 404/error
        const a = document.createElement('a');
        a.href = this.fallbackAssetPdfUrl;
        a.download = 'SK-Fabricator-Company-Profile.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
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
