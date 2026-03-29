import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'menu-opener',
  imports: [NgClass],
  templateUrl: './menu-opener.component.html',
  styleUrl: './menu-opener.component.scss',
})
export class MenuOpenerComponent {
  isOpen = signal<boolean>(false)

  changeStatus() {
    this.isOpen.update((val) => !val)
  }
}
