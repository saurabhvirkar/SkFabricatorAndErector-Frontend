import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private readonly currentUserRoleSubject = new BehaviorSubject<string | null>(this.getStoredRole());
  readonly currentUserRole$ = this.currentUserRoleSubject.asObservable();

  // ── Token accessors ──────────────────────────────────────────────

  getToken(): string | null {
    return this.inBrowser() ? localStorage.getItem('jwt_token') : null;
  }

  getRefreshToken(): string | null {
    return this.inBrowser() ? localStorage.getItem('refresh_token') : null;
  }

  isAdmin(): boolean {
    return this.currentUserRoleSubject.value?.toLowerCase() === 'admin';
  }

  // ── Auth operations ──────────────────────────────────────────────

  login(credentials: LoginRequest): Observable<ApiResponse<AuthTokens>> {
    return this.api.post<ApiResponse<AuthTokens>>('account/login', credentials).pipe(
      tap(response => {
        const { token, refreshToken, role } = response.data;
        if (token && role) {
          this.storeTokens(token, refreshToken, role);
          this.isLoggedInSubject.next(true);
          this.currentUserRoleSubject.next(role);
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse<AuthTokens>> {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return throwError(() => new Error('Missing tokens for refresh'));
    }

    return this.api.post<ApiResponse<AuthTokens>>('account/refresh-token', {
      accessToken,
      refreshToken
    }).pipe(
      tap(response => {
        this.storeTokens(response.data.token, response.data.refreshToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (this.inBrowser()) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
    }
    this.isLoggedInSubject.next(false);
    this.currentUserRoleSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ── Helpers ──────────────────────────────────────────────────────

  private hasToken(): boolean {
    return this.inBrowser() ? !!localStorage.getItem('jwt_token') : false;
  }

  private getStoredRole(): string | null {
    return this.inBrowser() ? localStorage.getItem('user_role') : null;
  }

  private storeTokens(token: string, refreshToken: string, role?: string): void {
    if (this.inBrowser()) {
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      if (role) localStorage.setItem('user_role', role);
    }
  }

  private inBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
