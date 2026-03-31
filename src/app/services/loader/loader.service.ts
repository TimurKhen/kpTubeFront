import { ComponentRef, Injectable, NgZone, Signal, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private componentRef: ComponentRef<LoaderComponent> | null = null
  private container!: ViewContainerRef
  private loadPromise: Promise<any> | null = null
  private currentTitle: Signal<string> | null = null
  private currentStatus: Signal<number> | null = null

  setContainer(vcr: ViewContainerRef) {
    this.container = vcr
  }

  async show(title: Signal<string>, status: Signal<number>) {
    this.hide()
    
    this.currentTitle = title
    this.currentStatus = status
    
    if (!this.loadPromise) {
      this.loadPromise = import('./loader/loader.component').then(m => m.LoaderComponent);
    }
    
    const componentType = await this.loadPromise
    
    this.container.injector.get(NgZone).run(() => {
      this.componentRef = this.container.createComponent(componentType)
      this.componentRef.setInput('title', title())
      this.componentRef.setInput('status', status())
    })

    this.componentRef?.instance.hide.subscribe(() => {
      this.hide()
    })
  }

  updateStatus(status: number) {
    if (this.componentRef && this.currentStatus) {
      this.container.injector.get(NgZone).run(() => {
        if (typeof this.currentStatus === 'function') {
          (this.currentStatus as any).set(status)
        }
        this.componentRef?.setInput('status', status)
      })
    }
  }

  updateTitle(title: string) {
    if (this.componentRef && this.currentTitle) {
      this.container.injector.get(NgZone).run(() => {
        if (typeof this.currentTitle === 'function') {
          (this.currentTitle as any).set(title)
        }
        this.componentRef?.setInput('title', title)
      })
    }
  }

  hide() {
    if (this.componentRef) {
      this.componentRef.destroy()
      this.componentRef = null
      this.currentTitle = null
      this.currentStatus = null
    }
  }
}