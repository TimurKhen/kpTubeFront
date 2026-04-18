import {
  Component,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  effect,
  OnInit
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { NgClass } from '@angular/common'
import { VideosService } from '../../services/videos-service/videos-service.service'
import { LoaderService } from '../../services/loader/loader.service'
import { Subscription } from 'rxjs'
import { VideoPlayerComponent } from '../../components/video-player/video-player.component'
import { AlertService } from '../../services/alert/alert.service'
import { Router } from '@angular/router'
import { UserService } from '../../services/user-service/user-service.service'
import { ProfileInterface } from '../../interfaces/profile/profile-interface'

@Component({
  selector: 'app-video-create',
  imports: [ReactiveFormsModule, VideoPlayerComponent, NgClass],
  templateUrl: './video-create.component.html',
  styleUrl: './video-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCreateComponent implements OnInit, OnDestroy {
  private videoService = inject(VideosService)
  private userService = inject(UserService)
  private loaderService = inject(LoaderService)
  private alertService = inject(AlertService)
  private router = inject(Router)

  videoForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    visibility: new FormControl<number>(0, Validators.required)
  })

  videoURL = signal<string>('')
  previewURL = signal<string>('')
  isLoading = signal<boolean>(false)
  userInformation = signal<ProfileInterface | null>(null)

  videoFile: File | null = null
  previewFile: File | null = null

  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>
  @ViewChild('previewInput') previewInput!: ElementRef<HTMLInputElement>

  private createVideoSubscription?: Subscription
  private worker: Worker

  constructor() {
    effect(() => {
      this.userInformation.set(this.userService.userData())
    })

    this.worker = new Worker(new URL('../../services/workers/file-reader.worker.ts', import.meta.url))
    this.worker.onmessage = (event) => {
      const { blob, fileName, error } = event.data
      if (error) {
        console.error('Worker error:', error)
        return
      }

      if (fileName === this.videoFile?.name) {
        if (this.videoURL()) {
          URL.revokeObjectURL(this.videoURL())
        }
        this.videoURL.set(URL.createObjectURL(blob))
      } else if (fileName === this.previewFile?.name) {
        if (this.previewURL()) {
          URL.revokeObjectURL(this.previewURL())
        }
        this.previewURL.set(URL.createObjectURL(blob))
      }
    }
  }

  ngOnInit() {
    this.userService.loadUserData()
  }

  onVideoChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0]
      this.worker.postMessage({ file: this.videoFile, action: 'processVideo' })
    }
  }

  onPreviewChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.previewFile = input.files[0]
      this.worker.postMessage({ file: this.previewFile, action: 'processVideo' })
    }
  }

  ngOnDestroy(): void {
    this.createVideoSubscription?.unsubscribe()
    this.worker.terminate()
    if (this.videoURL()) {
      URL.revokeObjectURL(this.videoURL())
    }
    if (this.previewURL()) {
      URL.revokeObjectURL(this.previewURL())
    }
  }

  clearVideo() {
    if (this.videoURL()) {
      URL.revokeObjectURL(this.videoURL())
    }
    this.videoURL.set('')
    this.videoFile = null
    if (this.videoInput) {
      this.videoInput.nativeElement.value = ''
    }
  }

  clearPreview() {
    if (this.previewURL()) {
      URL.revokeObjectURL(this.previewURL())
    }
    this.previewURL.set('')
    this.previewFile = null
    if (this.previewInput) {
      this.previewInput.nativeElement.value = ''
    }
  }

  changeCurrentVisibility(newVisibility: number) {
    this.videoForm.patchValue({
      'visibility': newVisibility
    })
  }

  async publish() {
    if (this.videoForm.valid && this.videoFile && this.previewFile) {
      this.isLoading.set(true)
      await this.loaderService.show(signal<string>('Загрузка видео'))

      console.log(this.userInformation())

      const userName = this.userInformation()?.username

      if (userName) {
        this.videoService.createVideo({
          Video_ID: String(Number(new Date())),
          video: this.videoFile!,
          name: this.videoForm.value.name!,
          description: this.videoForm.value.description || '',
          preview: this.previewFile!,
          owner: userName,
          category: "По умолчанию",
          isGlobal: true
        }).subscribe({
          next: (event) => {
            setTimeout(() => {
              this.isLoading.set(false)
              this.loaderService.hide()
              this.videoForm.reset()
              this.clearVideo()
              this.clearPreview()
              this.router.navigate(['/'])
              this.alertService.show(
                'Видео успешно создано!',
                '',
                false
              )
            }, 500)
          },
          error: (error) => {
            this.loaderService.hide()
            this.isLoading.set(false)
            this.alertService.show(
              'Ошибка при создании видео',
              error.details,
              true
            )
          }
        })
      } else {
        this.loaderService.hide()
        this.isLoading.set(false)
        this.userService.logout()
        this.alertService.show(
          'Ошибка при создании видео',
          'Вы не авторизованы',
          true
        )
      }
    }
  }
}
