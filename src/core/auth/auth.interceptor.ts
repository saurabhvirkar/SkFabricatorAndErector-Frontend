import { Injectable, inject, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Attaches the JWT Bearer token to every outgoing request.
 * On 401 responses, attempts a single token refresh before failing.
 * Uses Injector to lazily resolve AuthService and break circular DI dependency.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly injector = inject(Injector);
  private isRefreshing = false;
  private readonly refreshSubject = new BehaviorSubject<string | null>(null);

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    if (token) {
      request = this.attachToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (request.url.includes('/account/login') || request.url.includes('/account/refresh-token') || !token) {
            return throwError(() => error);
          }
          return this.handle401(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          const newToken = response.data?.token;
          if (newToken) {
            this.refreshSubject.next(newToken);
            return next.handle(this.attachToken(request, newToken));
          }
          this.authService.logout();
          return throwError(() => new Error('Refresh token invalid'));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }

    // Queue subsequent requests until refresh completes
    return this.refreshSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token => next.handle(this.attachToken(request, token)))
    );
  }

  private attachToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}
