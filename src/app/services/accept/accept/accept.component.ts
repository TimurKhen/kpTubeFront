import { Component, input, ChangeDetectionStrategy, output, signal } from '@angular/core';

@Component({
  selector: 'accept',
  imports: [],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class AcceptComponent {
  title = input<string>('')
  message = input<string>('')
  icon = input<string | null>('')

  hide = output<number>()
  
  isShow = signal<boolean>(true)

  onClose(button: number) {
    this.isShow.set(false)
    setTimeout(() => {
      this.hide.emit(button)
    }, 400)
  }
}