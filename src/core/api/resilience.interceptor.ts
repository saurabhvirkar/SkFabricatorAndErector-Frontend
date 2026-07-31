import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

/**
 * Angular 21 Resilient HTTP Interceptor
 * Features:
 * 1. Automatic Retries with Exponential Backoff + Jitter for transient errors (502, 503, 504, 0/Timeout).
 * 2. Only retries idempotent HTTP methods (GET, HEAD, OPTIONS) to prevent accidental duplicate mutations.
 * 3. Max 3 retry attempts with progressive delays (1s, 2s, 4s + random jitter).
 */
export const resilienceInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const isIdempotent = ['GET', 'HEAD', 'OPTIONS'].includes(req.method.toUpperCase());

  return next(req).pipe(
    retry({
      count: isIdempotent ? 3 : 0,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        const isTransientError =
          error.status === 0 || // Network error / CORS failure / connection timeout
          error.status === 502 || // Bad Gateway
          error.status === 503 || // Service Unavailable
          error.status === 504; // Gateway Timeout

        if (!isTransientError) {
          return throwError(() => error);
        }

        // Exponential backoff: 1s, 2s, 4s... + jitter (0 - 500ms)
        const backoffDelay = Math.pow(2, retryCount - 1) * 1000;
        const jitter = Math.floor(Math.random() * 500);
        const totalDelay = backoffDelay + jitter;

        console.warn(`[ResilienceInterceptor] Transient HTTP error ${error.status} on ${req.url}. Retrying attempt ${retryCount}/3 in ${totalDelay}ms...`);

        return timer(totalDelay);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Re-throw for downstream error handlers / components
      return throwError(() => error);
    })
  );
};
