import { AfterViewChecked, AfterViewInit, Component, ElementRef, input, OnChanges, OnInit, signal, ViewChild } from '@angular/core'
import { TimeConverterPipe } from "../../../pipes/time-converter/time-converter.pipe";

@Component({
  selector: 'video-player',
  imports: [TimeConverterPipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements OnChanges, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>
  @ViewChild('volumeBar') volumeBarRef!: ElementRef<HTMLInputElement>
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>
  
  video = input<string | undefined>()
  videoPoster = input<string | undefined>()
  isPlaying = signal<boolean>(true)
  currentVolume = signal<number>(1)
  currentTime = signal<number>(0)
  duration = signal<number>(0)

  private videoPlayer!: HTMLVideoElement

  ngAfterViewInit() {
    this.videoPlayer = this.videoPlayerRef.nativeElement
    this.videoPlayer.addEventListener('timeupdate', () => this.updateProgressBar())

    this.videoPlayer.addEventListener('loadedmetadata', () => {
      this.duration.set(Math.round(this.videoPlayer.duration))
      this.videoPlayer.play()
      this.isPlaying.set(true)
    })

    const volumeBar = this.volumeBarRef.nativeElement
    volumeBar.style.setProperty('--volume', `${this.currentVolume() * 100}%`)

    if (this.video()) {
      this.videoPlayer.load()
    }
  }

  ngOnChanges() {
    if (this.videoPlayer && this.video()) {
      this.videoPlayer.load()
      this.isPlaying.set(false)
      this.currentTime.set(0)
      this.duration.set(0)
    }
  }

  playPauseVideo() {
    if (this.videoPlayer) {
      if (this.videoPlayer.paused || this.videoPlayer.ended) {
        this.videoPlayer.play()
        this.isPlaying.set(true)
      } else {
        this.videoPlayer.pause()
        this.isPlaying.set(false)
      }
    }
  }


  setVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.videoPlayer.volume = parseFloat(value)
    this.currentVolume.set(parseFloat(value))
    if (parseFloat(value) > 0) {
      this.videoPlayer.muted = false
    }
    const volumeBar = this.volumeBarRef.nativeElement
    const percentage = parseFloat(value) * 100
    volumeBar.style.setProperty('--volume', `${percentage}%`)
  }

  updateProgressBar() {
    const percentage = (this.videoPlayer.currentTime / this.videoPlayer.duration) * 100
    const progress = this.progressBarRef.nativeElement
    progress.value = percentage.toString()
    progress.style.setProperty('--progress', `${percentage}%`)
    this.currentTime.set(Math.round(this.videoPlayer.currentTime))
    if (this.duration() !== this.videoPlayer.duration) {
      this.duration.set(Math.round(this.videoPlayer.duration))
    }
  }

  seekVideo(event: Event) {
    const value = (event.target as HTMLInputElement).value
    const percentage = parseFloat(value)
    const time = (percentage / 100) * this.videoPlayer.duration
    this.videoPlayer.currentTime = time
    const progress = this.progressBarRef.nativeElement
    progress.style.setProperty('--progress', `${percentage}%`)

    this.videoPlayer.play()
    this.isPlaying.set(true)
  }
}
