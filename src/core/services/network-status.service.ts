import { Injectable, signal, computed } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private isOnlineSignal = signal<boolean>(typeof window !== 'undefined' ? navigator.onLine : true);

  /** Signal exposing true if internet connection is active, false if offline */
  public readonly isOnline = this.isOnlineSignal.asReadonly();
  public readonly isOffline = computed(() => !this.isOnlineSignal());

  /** Observable stream of online status changes */
  public readonly status$: Observable<boolean>;

  constructor() {
    if (typeof window !== 'undefined') {
      this.status$ = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false))
      );

      this.status$.subscribe(online => {
        this.isOnlineSignal.set(online);
        if (!online) {
          console.warn('[NetworkStatusService] Connection dropped. App operating in offline mode.');
        } else {
          console.info('[NetworkStatusService] Connection restored.');
        }
      });
    } else {
      this.status$ = of(true);
    }
  }
}
