import { ComponentRef, Injectable, NgZone, Signal, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private componentRef: ComponentRef<LoaderComponent> | null = null
  private container!: ViewContainerRef
  private loadPromise: Promise<any> | null = null

  setContainer(vcr: ViewContainerRef) {
    this.container = vcr
  }

  async show(title: Signal<string>) {
    this.hide()
    
    if (!this.loadPromise) {
      this.loadPromise = import('./loader/loader.component').then(m => m.LoaderComponent);
    }
    
    const componentType = await this.loadPromise
    
    this.container.injector.get(NgZone).run(() => {
      this.componentRef = this.container.createComponent(componentType)
      this.componentRef.setInput('title', title())
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