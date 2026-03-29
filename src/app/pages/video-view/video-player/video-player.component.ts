import { AfterViewInit, Component, ElementRef, HostListener, input, OnChanges, OnInit, signal, ViewChild } from '@angular/core'
import { TimeConverterPipe } from "../../../pipes/time-converter/time-converter.pipe"

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
  lastVolumeValue = signal<number>(1)
  currentTime = signal<number>(0)
  duration = signal<number>(0)

  private videoPlayer!: HTMLVideoElement

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    const keysToDisable = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']
    
    if (keysToDisable.includes(event.key)) {
      event.preventDefault()
    }
    
    switch (event.key) {
      case ' ':
        this.playPauseVideo()
        break        
      case 'ArrowLeft':
        this.videoPlayer.currentTime = this.videoPlayer.currentTime - 5
        break
      case 'ArrowRight':
        this.videoPlayer.currentTime = this.videoPlayer.currentTime + 5
        break
      case 'm':
      case 'M':
      case 'ь':
      case 'Ь': 
        this.changeMuteStatus()
        break
    }
  }

  ngAfterViewInit() {
    this.videoPlayer = this.videoPlayerRef.nativeElement
    this.videoPlayer.addEventListener('timeupdate', () => this.updateProgressBar())

    this.videoPlayer.addEventListener('loadedmetadata', () => {
      this.duration.set(Math.round(this.videoPlayer.duration))
      this.videoPlayer.play()
      this.isPlaying.set(true)
    })

    this.videoPlayer.addEventListener('play', () => {
      this.isPlaying.set(true)
    })

    this.videoPlayer.addEventListener('pause', () => {
      this.isPlaying.set(false)
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
    this.lastVolumeValue.set(this.currentVolume())
    this.currentVolume.set(parseFloat(value))
    
    if (parseFloat(value) > 0) {
      this.videoPlayer.muted = false
    }
    this.updateVolumeBar(value)
  }

  updateVolumeBar(value: string) {
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
  }

  changeMuteStatus() {
    if (this.currentVolume() == 0) {
      this.currentVolume.set(this.lastVolumeValue())
      this.videoPlayer.muted = false
    } else {
      this.lastVolumeValue.set(this.currentVolume())
      this.currentVolume.set(0)
      this.videoPlayer.muted = true
    }

    this.updateVolumeBar(String(this.currentVolume()))
  }

  async togglePip() {
    const video = this.videoPlayer
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
    } catch (error) {
      console.error('PiP error:', error)
    }
  }
}