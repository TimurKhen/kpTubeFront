import { Component, input } from '@angular/core';
import { Video } from '../../interfaces/video/video';
import { ShortNumberPipe } from "../../pipes/short-number/short-number.pipe";
import { TimeAgoPipe } from "../../pipes/time-ago/time-ago-pipe.pipe";

@Component({
  selector: 'app-account-video',
  imports: [ShortNumberPipe, TimeAgoPipe],
  templateUrl: './account-video.component.html',
  styleUrl: './account-video.component.scss',
})
export class AccountVideoComponent {
  content = input.required<Video>()

  makeShortTitle(title: string) {
    const maxStringLength = 35
    if (title.length > maxStringLength) {
      return title.substring(0, maxStringLength) + '...'
    } else {
      return title
    }
  }
}
