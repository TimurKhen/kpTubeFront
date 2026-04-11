import { Injectable } from '@angular/core';
import { fromEvent, map, merge, Observable, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class OnlineHandlerService {
  private onlineChanges$ = merge(
    fromEvent(window, 'offline').pipe(map(() => false)),
    fromEvent(window, 'online').pipe(map(() => true))
  ).pipe(
    startWith(navigator.onLine)
  );

  public isOnline = toSignal(this.onlineChanges$, { initialValue: navigator.onLine })
}
