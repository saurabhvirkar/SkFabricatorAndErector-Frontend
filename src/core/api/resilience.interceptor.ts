import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, timer, throwError, of, TimeoutError } from 'rxjs';
import { retry, catchError, timeout, tap } from 'rxjs/operators';

/** Structured Fault Data Telemetry Payload */
export interface FaultData {
  correlationId: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
  errorName: string;
  timestamp: string;
  attemptCount: number;
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

/** Client-Side Circuit Breaker State Management */
class ClientCircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private lastStateChange = Date.now();
  private readonly failureThreshold = 5;
  private readonly resetTimeoutMs = 15000; // 15 seconds open duration

  public getState(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    if (this.state === 'OPEN' && Date.now() - this.lastStateChange > this.resetTimeoutMs) {
      this.state = 'HALF_OPEN';
      console.info('[CircuitBreaker] Circuit transitioned from OPEN to HALF_OPEN (Trial state).');
    }
    return this.state;
  }

  public recordSuccess(): void {
    this.failureCount = 0;
    if (this.state !== 'CLOSED') {
      this.state = 'CLOSED';
      this.lastStateChange = Date.now();
      console.info('[CircuitBreaker] Circuit RESET to CLOSED.');
    }
  }

  public recordFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.lastStateChange = Date.now();
      console.error(`[CircuitBreaker] Circuit TRIPPED to OPEN after ${this.failureCount} consecutive failures.`);
    }
  }
}

const circuitBreaker = new ClientCircuitBreaker();

function generateCorrelationId(): string {
  return 'corr-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
}

/**
 * Angular 21 Comprehensive Enterprise Resilient HTTP Interceptor
 * Implements:
 * 1. Correlation ID Header Propagation (Correlation-Id)
 * 2. Client-Side Offline Detection (navigator.onLine)
 * 3. Request Classification (Only retries GET/HEAD/OPTIONS idempotent reads)
 * 4. Wait & Retry + Exponential Backoff + Jitter
 * 5. Request Timeout (15s cap)
 * 6. Client-Side Circuit Breaker & Broken Circuit protection
 * 7. Safe Fallback handling exclusively for GET read-only requests
 * 8. Enriched Fault Data structured logging
 */
export const resilienceInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const isIdempotent = ['GET', 'HEAD', 'OPTIONS'].includes(req.method.toUpperCase());

  // 1. Attach Correlation-Id for end-to-end distributed tracing
  const correlationId = req.headers.get('Correlation-Id') || generateCorrelationId();
  const clonedReq = req.clone({
    headers: req.headers.set('Correlation-Id', correlationId)
  });

  // 2. Client Offline Detection (Avoid retrying when client has no network)
  if (typeof window !== 'undefined' && !navigator.onLine) {
    console.warn(`[ResilienceInterceptor] Client is offline. Aborting request ${req.url}`);
    if (isIdempotent) {
      console.warn(`[Fallback] Delivering offline fallback response for GET ${req.url}`);
      return of(new HttpResponse({ status: 200, body: [] }));
    }
    return throwError(() => new Error('[Offline] No internet connection available.'));
  }

  // 3. Circuit Breaker Check
  if (circuitBreaker.getState() === 'OPEN') {
    const faultData: FaultData = {
      correlationId,
      url: req.url,
      method: req.method,
      status: 503,
      statusText: 'Circuit Breaker Open (Broken Circuit Exception)',
      errorName: 'BrokenCircuitException',
      timestamp: new Date().toISOString(),
      attemptCount: 0,
      circuitState: 'OPEN'
    };

    console.error('[CircuitBreaker] Request rejected: Circuit is currently BROKEN/OPEN.', faultData);

    // Fallback response ONLY for read-only GET requests
    if (isIdempotent) {
      console.warn(`[Fallback] Delivering empty fallback array for GET ${req.url}`);
      return of(new HttpResponse({ status: 200, body: [] }));
    }

    return throwError(() => new Error(`[BrokenCircuitException] Service unavailable: Circuit is OPEN for ${req.url}`));
  }

  // 4. Request execution with Timeout (15s) and Retry with Exponential Backoff
  return next(clonedReq).pipe(
    timeout(15000), // 15s Request Timeout
    tap(() => circuitBreaker.recordSuccess()),
    retry({
      count: isIdempotent ? 3 : 0,
      delay: (error: HttpErrorResponse | TimeoutError, retryCount: number) => {
        const isTimeout = error instanceof TimeoutError;
        const status = error instanceof HttpErrorResponse ? error.status : 408;

        const isTransientError =
          isTimeout ||
          status === 0 ||   // Network disconnect / Timeout / CORS error
          status === 408 || // Request Timeout
          status === 502 || // Bad Gateway
          status === 503 || // Service Unavailable
          status === 504;   // Gateway Timeout

        if (!isTransientError) {
          return throwError(() => error);
        }

        circuitBreaker.recordFailure();

        // Exponential Backoff: 1s, 2s, 4s... + Jitter (0-500ms)
        const backoffDelay = Math.pow(2, retryCount - 1) * 1000;
        const jitter = Math.floor(Math.random() * 500);
        const totalDelay = backoffDelay + jitter;

        const faultData: FaultData = {
          correlationId,
          url: req.url,
          method: req.method,
          status,
          statusText: isTimeout ? 'TimeoutRejectedException' : (error as HttpErrorResponse).message,
          errorName: isTimeout ? 'TimeoutRejectedException' : 'HttpErrorResponse',
          timestamp: new Date().toISOString(),
          attemptCount: retryCount,
          circuitState: circuitBreaker.getState()
        };

        console.warn(`[WaitAndRetry] Transient failure on attempt ${retryCount}/3 for ${req.url}. Retrying in ${totalDelay}ms...`, faultData);

        return timer(totalDelay);
      }
    }),
    catchError((error: HttpErrorResponse | TimeoutError) => {
      circuitBreaker.recordFailure();

      const isTimeout = error instanceof TimeoutError;
      const status = error instanceof HttpErrorResponse ? error.status : 408;

      const faultData: FaultData = {
        correlationId,
        url: req.url,
        method: req.method,
        status,
        statusText: isTimeout ? 'TimeoutRejectedException' : (error as HttpErrorResponse).message,
        errorName: isTimeout ? 'TimeoutRejectedException' : 'HttpErrorResponse',
        timestamp: new Date().toISOString(),
        attemptCount: 3,
        circuitState: circuitBreaker.getState()
      };

      console.error('[ResilienceInterceptor] Final request failure recorded:', faultData);

      return throwError(() => error);
    })
  );
};
