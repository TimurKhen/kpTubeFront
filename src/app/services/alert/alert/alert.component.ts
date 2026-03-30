import { NgClass } from '@angular/common';
import { Component, input, OnDestroy, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { delay, Subject } from 'rxjs';

@Component({
  selector: 'alert',
  imports: [NgClass],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class AlertComponent {
  private timeout$ = new Subject<void>()

  isError = input<boolean>(false)
  title = input<string>('')
  message = input<string>('')

  hide = output()
  isClosing = signal<boolean>(false)
  
  constructor() {
    this.timeout$
      .pipe(
        delay(5500)
      )
      .subscribe(() => {
        this.onClose()
      })
    this.timeout$.next()
  }

  onClose() {
    this.isClosing.set(true)

    setTimeout(() => {
      this.isClosing.set(false)
      this.timeout$.unsubscribe()
      this.hide.emit()
    }, 300)
  }
}