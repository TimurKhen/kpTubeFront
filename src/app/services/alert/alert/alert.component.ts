import { NgClass } from '@angular/common';
import { Component, input, ChangeDetectionStrategy, output, signal } from '@angular/core';
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
  
  isShow = signal<boolean>(true)
  
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
    this.isShow.set(false)
    setTimeout(() => {
      this.timeout$.unsubscribe()
      this.hide.emit()
    }, 400)
  }
}