import { Injectable, ViewContainerRef, ComponentRef, NgZone } from '@angular/core';
import { AcceptComponent } from './accept/accept.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcceptService {
  private componentRef: ComponentRef<AcceptComponent> | null = null
  private container!: ViewContainerRef
  private loadPromise: Promise<any> | null = null

  setContainer(vcr: ViewContainerRef) {
    this.container = vcr
  }

  show(title: string = '', message: string = '', icon: string = ''): Observable<any> {
    this.hide()
    const resultSubject = new Subject<any>()

    if (!this.loadPromise) {
      this.loadPromise = import('./accept/accept.component').then(m => m.AcceptComponent)
    }

    this.loadPromise.then(componentType => {
      this.container.injector.get(NgZone).run(() => {
        this.componentRef = this.container.createComponent(componentType)
        this.componentRef.setInput('title', title)
        this.componentRef.setInput('message', message)
        this.componentRef.setInput('icon', icon)
      })

      const hideSub = this.componentRef?.instance.hide.subscribe((val) => {
        resultSubject.next(val)
        resultSubject.complete()
        this.hide()
        hideSub?.unsubscribe()
      })
    }).catch(error => {
      resultSubject.error(error)
    })

    return resultSubject.asObservable();
  }

  hide() {
    if (this.componentRef) {
      this.componentRef.destroy()
      this.componentRef = null
    }
  }
}