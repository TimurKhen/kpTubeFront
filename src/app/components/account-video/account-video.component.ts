import { Component, inject, input, output } from '@angular/core';
import { VideoInterface } from '../../interfaces/video/video';
import { ShortNumberPipe } from "../../pipes/short-number/short-number.pipe";
import { TimeAgoPipe } from "../../pipes/time-ago/time-ago-pipe.pipe";
import { AcceptService } from '../../services/accept/accept.service';
import {PathConverterPipe} from "../../pipes/path-converter/path-converter.pipe";

@Component({
  selector: 'app-account-video',
  imports: [ShortNumberPipe, TimeAgoPipe, PathConverterPipe],
  templateUrl: './account-video.component.html',
  styleUrl: './account-video.component.scss',
})
export class AccountVideoComponent {
  acceptService = inject(AcceptService)

  content = input.required<VideoInterface>()

  status = output<string>()
  delete = output<string>()

  changeStatus(newType: number) {
    this.acceptService.show(
      'Поменять доступность видео: ' + this.content().name,
      `Вы уверены, что хотите поменять статус
        видео на ${newType == 0 ? 'по ссылке' : 'глобальный'}`,
      newType == 0 ? './icons/link-icon.svg' : './icons/wide-icon.svg'
    ).subscribe((val) => {
      console.log(val)
    })
  }

  deleteBlock() {
    this.acceptService.show(
      'Удалить видео: ' + this.content().name,
      'Вы уверены, что вы хотите удалить это видео?',
      './icons/red-trash-icon.svg'
    ).subscribe((val) => {
      if (val == 1) {
        this.delete.emit(String(this.content().id))
      }
    })
  }

  makeShortTitle(title: string) {
    const maxStringLength = 35
    if (title.length > maxStringLength) {
      return title.substring(0, maxStringLength) + '...'
    } else {
      return title
    }
  }
}
