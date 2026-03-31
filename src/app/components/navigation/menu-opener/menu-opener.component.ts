import { NgClass } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'menu-opener',
  imports: [NgClass],
  templateUrl: './menu-opener.component.html',
  styleUrl: './menu-opener.component.scss',
})
export class MenuOpenerComponent {
  isOpenInput = input<boolean>(false)
  isOpenOutput = output<boolean>()
  isOpen = signal<boolean>(this.isOpenInput())

  constructor() {
    effect(() => {
      this.isOpen.set(this.isOpenInput())
    })
  }

  changeStatus() {
    this.isOpen.update((val) => !val)
    this.isOpenOutput.emit(this.isOpen())
  }
}
