import { AfterViewInit, Component, computed, ElementRef, HostListener, input, OnChanges, OnInit, signal, ViewChild } from '@angular/core'
import { NgStyle, NgClass } from '@angular/common'
import { TimeConverterPipe } from '../../pipes/time-converter/time-converter.pipe'

@Component({
  selector: 'video-player',
  imports: [TimeConverterPipe, NgStyle, NgClass],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements OnChanges, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>
  @ViewChild('volumeBar') volumeBarRef!: ElementRef<HTMLInputElement>
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>
  @ViewChild('controls') controlsRef!: ElementRef<HTMLDivElement>
  @ViewChild('playerContainer') playerContainerRef!: ElementRef<HTMLDivElement> 

  video = input<string | undefined>()
  videoPoster = input<string | undefined>()
  alwaysShowUI = input<boolean>(false)

  isPlaying = signal<boolean>(true)
  currentVolume = signal<number>(1)
  lastVolumeValue = signal<number>(1)
  currentTime = signal<number>(0)
  duration = signal<number>(0)
  isAnimatingEffect = signal<boolean>(false)
  currentEffectSrc = signal<string>('')
  currentVolumeIcon = computed(() => {
    if (this.currentVolume() > 0.8) {
      return "volume/volume-max-icon.svg"
    }
    else if (this.currentVolume() > 0.4) {
      return "volume/volume-mid-icon.svg"
    }
    else if (this.currentVolume() > 0) {
      return "volume/volume-min-icon.svg"
    } 
    else {
      return "volume/volume-zero-icon.svg"
    }
  })
  
  currentEffectTimeout: any
  controlsTimeout: any
  private videoPlayer!: HTMLVideoElement

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const isInputFocused = 
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable

    if (isInputFocused) {
      return
    }

    const keysToDisable = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']

    if (keysToDisable.includes(event.key)) {
      event.preventDefault()
    }

    switch (event.key) {
      case ' ':
        const isPlay = this.playPauseVideo()
        if (isPlay) {
          this.animateEffect('play-icon.svg')
        } else {
          this.animateEffect('stop-icon.svg')
        }
        break
      case 'ArrowLeft':
        this.videoPlayer.currentTime = this.videoPlayer.currentTime - 5
        this.animateEffect('left-icon.svg')
        break
      case 'ArrowRight':
        this.videoPlayer.currentTime = this.videoPlayer.currentTime + 5
        this.animateEffect('right-icon.svg')
        break
      case 'ArrowDown':
        this.setVolume(String(this.currentVolume() - 0.1))
        this.animateEffect(this.currentVolumeIcon())
        break
      case 'ArrowUp':
        this.setVolume(String(this.currentVolume() + 0.1))
        this.animateEffect(this.currentVolumeIcon())
        break
      case 'm':
      case 'M':
      case 'ь':
      case 'Ь':
        const isMuted = this.changeMuteStatus()
        if (isMuted) {
          this.animateEffect('volume/volume-zero-icon.svg')
        } else {
          this.animateEffect('volume/volume-max-icon.svg')
        }
        break
      case 'а':
      case 'А':
      case 'f':
      case 'F':
        this.toggleSize()
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

    const container = this.playerContainerRef.nativeElement;
    
    container.addEventListener('mousemove', () => this.showControls());
    container.addEventListener('mouseleave', () => this.hideControls());

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
        return true
      } else {
        this.videoPlayer.pause()
        this.isPlaying.set(false)
        return false
      }
    }
    return false
  }

  showControls() {
    const controls = this.controlsRef?.nativeElement
    if (controls) {
      controls.style.opacity = '1'

      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout)
      }
      this.controlsTimeout = setTimeout(() => {
        this.hideControls()
      }, 3000)
    }
  }

  hideControls() {
    const controls = this.controlsRef?.nativeElement
    const isHoveringControls = controls?.matches(':hover')

    if (controls && !this.videoPlayer.paused && !isHoveringControls) {
      controls.style.opacity = '0'
    }
  }

  setVolumeEvent(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.setVolume(value)
  }

  setVolume(value: string) {
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
    return this.videoPlayer.muted
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

  async toggleSize() {
    const container = document.querySelector('.player-container')    
    try {
      if (!document.fullscreenElement) {
        await container?.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  animateEffect(src: string) {
    this.isAnimatingEffect.set(false)
    clearTimeout(this.currentEffectTimeout)

    this.currentEffectSrc.set(src)
    this.isAnimatingEffect.set(true)

    this.currentEffectTimeout = setTimeout(() => {
      this.isAnimatingEffect.set(false)
    }, 400)
  }
}