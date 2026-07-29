import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/** Generic API response wrapper emitted by the new backend's auth endpoints. */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Centralised HTTP client for all backend API calls.
 * Authentication headers are injected by AuthInterceptor — do not set them here.
 */
@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl = environment.apiUrl;

  // ── Read ────────────────────────────────────────────────────────

  get<T>(endpoint: string, options: object = {}): Observable<T> {
    if (!isPlatformBrowser(this.platformId)) {
      return of<T>([] as unknown as T);
    }
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, { withCredentials: true, ...options })
      .pipe(catchError(this.handleError));
  }

  // ── Write ───────────────────────────────────────────────────────

  post<T>(endpoint: string, data: unknown, isFormDataOrOptions: boolean | object = false): Observable<T> {
    const isForm = typeof isFormDataOrOptions === 'boolean'
      ? isFormDataOrOptions || (data instanceof FormData)
      : (data instanceof FormData);
    const extraOptions = typeof isFormDataOrOptions === 'object' ? isFormDataOrOptions : {};

    const reqOptions = isForm
      ? { withCredentials: true, ...extraOptions }
      : { headers: { 'Content-Type': 'application/json' }, withCredentials: true, ...extraOptions };

    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data, reqOptions)
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: unknown, isFormData?: boolean): Observable<T> {
    const isForm = isFormData !== undefined ? isFormData : (data instanceof FormData);
    const options = isForm 
      ? { withCredentials: true } 
      : { headers: { 'Content-Type': 'application/json' }, withCredentials: true };

    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  // ── Error handling ───────────────────────────────────────────────

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong. Please try again later.';

    if (error.status === 0) {
      message = 'Unable to reach the server. Please check your connection.';
    } else if (error.status === 400) {
      message = error.error?.message ?? 'Invalid request. Please check your input.';
    } else if (error.status === 401) {
      message = 'Session expired. Please log in again.';
    } else if (error.status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      message = 'The requested resource was not found.';
    } else if (error.status === 409) {
      message = error.error?.message ?? 'A conflict occurred. The record may already exist.';
    } else if (error.status >= 500) {
      message = 'A server error occurred. Please try again later.';
    }

    if (!error.url?.includes('account/refresh-token')) {
      console.error(`API Error [${error.status}]:`, error);
    }
    return throwError(() => new Error(message));
  }
}
