import { Component, input, output, signal } from '@angular/core';
import { LoaderIconComponent } from "./loader-icon/loader-icon.component";

@Component({
  selector: 'app-loader',
  imports: [LoaderIconComponent],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  title = input<string>('')
  hide = output()

  isShow = signal<boolean>(true)
  
  onClose() {
    this.isShow.set(false)
    setTimeout(() => {
      this.hide.emit()
    }, 400)
  }
}
