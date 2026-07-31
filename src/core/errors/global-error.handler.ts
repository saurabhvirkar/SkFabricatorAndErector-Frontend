import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';

    console.error('[GlobalErrorHandler] Uncaught client error caught:', {
      message,
      stack,
      timestamp: new Date().toISOString()
    });

    // Prevent full UI unmounting/crashing while allowing logging
  }
}
