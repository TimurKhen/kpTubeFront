import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TimeAgoPipe } from "../../../../pipes/time-ago/time-ago-pipe.pipe";
import { ShortNumberPipe } from '../../../../pipes/short-number/short-number.pipe';
import { VideoInterface } from '../../../../interfaces/video/video';
import { PathConverterPipe } from "../../../../pipes/path-converter/path-converter.pipe";
import { UserService } from '../../../../services/user-service/user-service.service';

@Component({
  selector: 'video-preview',
  imports: [TimeAgoPipe, ShortNumberPipe, PathConverterPipe],
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss',
})
export class VideoPreviewComponent implements OnInit {
  userService = inject(UserService)
  content = input.required<VideoInterface>()
  currentPreviewImage = signal<string>('')
  authorAvatar = signal<string>('')
  authorId = signal<string>('')

  makeShortTitle(title: string) {
    const maxStringLength = 35
    if (title.length > maxStringLength) {
      return title.substring(0, maxStringLength) + '...'
    } else {
      return title
    }
  }

  createDate(date: string) {
    return new Date(+date)
  }

  ngOnInit(): void {
    this.currentPreviewImage.set(this.content().preview)
    this.getAuthorAvatar(this.content().owner)
  }

  getAuthorAvatar(author: string) {
    this.userService.getUserByName(author).subscribe((user) => {
      this.authorAvatar.set(user[0].avatar)
      this.authorId.set(user[0].User_ID)
    })
  }
}
