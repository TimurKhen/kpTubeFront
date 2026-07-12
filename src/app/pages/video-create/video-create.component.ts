import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core'
import {NgClass} from '@angular/common'
import {VideosService} from '../../services/videos-service/videos-service.service'
import {LoaderService} from '../../services/loader/loader.service'
import {Subscription} from 'rxjs'
import {VideoPlayerComponent} from '../../components/video-player/video-player.component'
import {AlertService} from '../../services/alert/alert.service'
import {Router} from '@angular/router'
import {UserService} from '../../services/user-service/user-service.service'
import {ProfileInterface} from '../../interfaces/profile/profile-interface'
import {form, FormField, maxLength, required} from "@angular/forms/signals";

interface videoInterface {
  name: string;
  description: string;
  visibility: number;
}

@Component({
  selector: 'app-video-create',
  imports: [VideoPlayerComponent, NgClass, FormField],
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

  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>
  @ViewChild('previewInput') previewInput!: ElementRef<HTMLInputElement>

  videoData = signal<videoInterface>({
    name: '', description: '', visibility: 0,
  })
  videoForm = form(this.videoData, (schema) => {
    required(schema.name, {message: 'Название видео обязательно'})
    required(schema.description, {message: 'Название видео обязательно'})
    required(schema.visibility)
    maxLength(schema.name, 70)
    maxLength(schema.description, 2500)
  })
  videoURL = signal<string>('')
  previewURL = signal<string>('')
  isLoading = signal<boolean>(false)
  userInformation = signal<ProfileInterface | null>(null)
  videoFile: File | null = null
  previewFile: File | null = null
  private worker: Worker

  constructor() {
    effect(() => {
      this.userInformation.set(this.userService.userData())
    })

    this.worker = new Worker(new URL('../../services/workers/file-reader.worker.ts', import.meta.url))
    this.worker.onmessage = (event) => {
      const {blob, fileName, error} = event.data
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
      this.worker.postMessage({file: this.videoFile, action: 'processVideo'})
    }
  }

  onPreviewChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.previewFile = input.files[0]
      this.worker.postMessage({file: this.previewFile, action: 'processVideo'})
    }
  }

  ngOnDestroy(): void {
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
    this.videoForm.visibility().value.set(newVisibility)
  }

  async publish() {
    if (this.videoForm().valid() && this.videoFile && this.previewFile) {
      this.isLoading.set(true)
      await this.loaderService.show(signal<string>('Загрузка видео'))

      const userName = this.userInformation()?.username
      const formValues = this.videoData()

      if (userName) {
        this.videoService.createVideo({
          Video_ID: String(Number(new Date())),
          video: this.videoFile!,
          name: formValues.name,
          description: formValues.description,
          preview: this.previewFile!,
          owner: userName,
          category: "По умолчанию",
          isGlobal: formValues.visibility === 0
        }).subscribe({
          next: (event) => {
            setTimeout(() => {
              this.isLoading.set(false)
              this.loaderService.hide()
              this.videoForm().reset()
              this.clearVideo()
              this.clearPreview()
              this.router.navigate(['/'])
              this.alertService.show('Видео успешно создано!', '', false)
            }, 500)
          }, error: (error) => {
            this.loaderService.hide()
            this.isLoading.set(false)
            this.alertService.show('Ошибка при создании видео', error.details, true)
          }
        })
      } else {
        this.loaderService.hide()
        this.isLoading.set(false)
        this.userService.logout()
        this.alertService.show('Ошибка при создании видео', 'Вы не авторизованы', true)
      }
    }
  }
}
