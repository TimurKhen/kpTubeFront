import { Injectable, ViewContainerRef, ComponentRef, NgZone } from '@angular/core';
import { AlertComponent } from './alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private componentRef: ComponentRef<AlertComponent> | null = null
  private container!: ViewContainerRef
  private loadPromise: Promise<any> | null = null

  setContainer(vcr: ViewContainerRef) {
    this.container = vcr
  }

  async show(title: string = '', message: string = '', isError: boolean = false) {
    this.hide()
    
    if (!this.loadPromise) {
      this.loadPromise = import('./alert/alert.component').then(m => m.AlertComponent);
    }
    
    const componentType = await this.loadPromise
    
    this.container.injector.get(NgZone).run(() => {
      this.componentRef = this.container.createComponent(componentType)
      this.componentRef.setInput('isError', isError)
      this.componentRef.setInput('title', title)
      this.componentRef.setInput('message', message)
    })

    this.componentRef?.instance.hide.subscribe(() => {
      this.hide()
    })
  }

  hide() {
    if (this.componentRef) {
      this.componentRef.destroy()
      this.componentRef = null
    }
  }
}