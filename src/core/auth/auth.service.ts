import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiClientService, ApiResponse } from '../api/api-client.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private inMemoryToken: string | null = null;

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private readonly currentUserRoleSubject = new BehaviorSubject<string | null>(this.getStoredRole());
  readonly currentUserRole$ = this.currentUserRoleSubject.asObservable();

  constructor() {
    if (this.inBrowser()) {
      // Clear legacy raw tokens from localStorage if present
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('refresh_token');
      this.initSilentRefresh();
    }
  }

  // ── Token accessors ──────────────────────────────────────────────

  getToken(): string | null {
    return this.inMemoryToken;
  }

  isAdmin(): boolean {
    return this.currentUserRoleSubject.value?.toLowerCase() === 'admin';
  }

  // ── Auth operations ──────────────────────────────────────────────

  login(credentials: LoginRequest): Observable<ApiResponse<AuthTokens>> {
    return this.api.post<ApiResponse<AuthTokens>>('account/login', credentials, { withCredentials: true }).pipe(
      tap(response => {
        const { token, role } = response.data;
        if (token) {
          this.inMemoryToken = token;
          this.isLoggedInSubject.next(true);
          if (role) {
            this.currentUserRoleSubject.next(role);
            if (this.inBrowser()) {
              localStorage.setItem('user_role', role);
            }
          }
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse<AuthTokens>> {
    return this.api.post<ApiResponse<AuthTokens>>('account/refresh-token', {
      accessToken: this.inMemoryToken ?? ''
    }, { withCredentials: true }).pipe(
      tap(response => {
        if (response.data?.token) {
          this.inMemoryToken = response.data.token;
          this.isLoggedInSubject.next(true);
          if (response.data.role) {
            this.currentUserRoleSubject.next(response.data.role);
            if (this.inBrowser()) {
              localStorage.setItem('user_role', response.data.role);
            }
          }
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (this.inBrowser()) {
      localStorage.removeItem('user_role');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('refresh_token');
    }
    this.inMemoryToken = null;
    this.isLoggedInSubject.next(false);
    this.currentUserRoleSubject.next(null);
    this.api.post('account/logout', {}, { withCredentials: true }).subscribe({ error: () => {} });
    this.router.navigate(['/login']);
  }

  private initSilentRefresh(): void {
    if (this.getStoredRole()) {
      this.refreshToken().subscribe({ error: () => {} });
    }
  }

  private getStoredRole(): string | null {
    return this.inBrowser() ? localStorage.getItem('user_role') : null;
  }

  private inBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
