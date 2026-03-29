import { AfterViewInit, Component, ElementRef, input, signal, ViewChild } from '@angular/core'
import { TimeConverterPipe } from "../../../pipes/time-converter/time-converter.pipe";

@Component({
  selector: 'video-player',
  imports: [TimeConverterPipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>
  @ViewChild('volumeBar') volumeBarRef!: ElementRef<HTMLInputElement>
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>
  
  video = input.required<string | undefined>()
  videoPoster = input<string | undefined>()
  isPlaying = signal<boolean>(true)
  currentVolume = signal<number>(1)
  currentTime = signal<number>(0)
  duration = signal<number>(0)

  private videoPlayer!: HTMLVideoElement

  ngAfterViewInit() {
    this.videoPlayer = this.videoPlayerRef.nativeElement
    this.videoPlayer.addEventListener('timeupdate', () => {
      this.updateProgressBar()
    })

    this.videoPlayer.play()
    this.isPlaying.set(true)
    this.duration.set(Math.round(this.videoPlayer.duration))
  }

  playPauseVideo() {
    if (this.videoPlayer.paused || this.videoPlayer.ended) {
      this.videoPlayer.play()
      this.isPlaying.set(true)
    } else {
      this.videoPlayer.pause()
      this.isPlaying.set(false)
    }
  }


  setVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.videoPlayer.volume = parseFloat(value)
    this.currentVolume.set(parseFloat(value))
    if (parseFloat(value) > 0) {
      this.videoPlayer.muted = false
    }
  }

  updateProgressBar() {
    const percentage = (this.videoPlayer.currentTime / this.videoPlayer.duration) * 100
    this.progressBarRef.nativeElement.value = percentage.toString()
    this.currentTime.set(Math.round(this.videoPlayer.currentTime))
    if (this.duration() !== this.videoPlayer.duration) {
      this.duration.set(Math.round(this.videoPlayer.duration))
    }
  }

  seekVideo(event: Event) {
    const value = (event.target as HTMLInputElement).value
    const time = (parseFloat(value) / 100) * this.videoPlayer.duration
    this.videoPlayer.currentTime = time
    this.videoPlayer.play()
    this.isPlaying.set(true)
  }
}
