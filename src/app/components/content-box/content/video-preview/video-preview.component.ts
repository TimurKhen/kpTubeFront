import { Component, input, OnInit, signal } from '@angular/core';
import { VideoPreview } from '../../../../interfaces/video/preview';
import { TimeAgoPipe } from "../../../../pipes/time-ago/time-ago-pipe.pipe";
import { ShortNumberPipe } from '../../../../pipes/short-number/short-number.pipe';
import { filter, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';

@Component({
  selector: 'video-preview',
  imports: [TimeAgoPipe, ShortNumberPipe],
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss',
})
export class VideoPreviewComponent implements OnInit {
  content = input.required<VideoPreview>()
  currentPreviewImage = signal<string>('')

  previewState$ = new Subject<boolean>()

  previewStatus$ = this.previewState$.pipe(
    switchMap(isHovering => {
      if (isHovering) {
        return timer(700).pipe(
          takeUntil(this.previewState$.pipe(
            filter(v => !v)
          )),
          tap(() => {
            this.currentPreviewImage.set('./templates/template_preview_video.gif')
          })
        )
      } else {
        this.currentPreviewImage.set(this.content().preview)
        return []
      }
    })
  )

  constructor() {
    this.previewStatus$.subscribe()
  }

  makeShortTitle(title: string) {
    const maxStringLength = 35
    if (title.length > maxStringLength) {
      return title.substring(0, maxStringLength) + '...'
    } else {
      return title
    }
  }

  ngOnInit(): void {
    this.currentPreviewImage.set(this.content().preview)
  }

  showPreviewVideo() {
    this.previewState$.next(true)
  }

  hidePreviewVideo() {
    this.previewState$.next(false)
  }
}
