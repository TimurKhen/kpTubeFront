import { Component, input, effect, signal } from '@angular/core';
import { delay, Subject } from 'rxjs';

@Component({
  selector: 'app-bottom-bar',
  imports: [],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss',
})
export class BottomBarComponent {
  private timeout$ = new Subject<void>()

  message = input<string | null>()
  mustHide = input<boolean>(false)
  isShow = signal<boolean>(!this.mustHide())

  constructor() {
    effect(() => {
      // console.log(this.message())
    })

    if (this.mustHide()) {
      this.timeout$
        .pipe(
          delay(5500)
        )
        .subscribe(() => {
          this.hide()
        })
      this.timeout$.next()
    }
  }

  hide() {
    this.isShow.set(false)
  }
}
