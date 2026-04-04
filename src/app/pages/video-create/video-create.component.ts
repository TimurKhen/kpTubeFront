import { Component, inject, OnDestroy, signal, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { VideoPlayerComponent } from "../video-view/video-player/video-player.component"
import { NgClass } from '@angular/common'
import { VideosService } from '../../services/videos-service/videos-service.service'
import { LoaderService } from '../../services/loader/loader.service'
import { HttpEvent, HttpEventType } from '@angular/common/http'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-video-create',
  imports: [ReactiveFormsModule, VideoPlayerComponent, NgClass],
  templateUrl: './video-create.component.html',
  styleUrl: './video-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCreateComponent implements OnDestroy {
  private videoService = inject(VideosService)
  private loaderService = inject(LoaderService)

  videoForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    visibility: new FormControl<number>(0, Validators.required)
  })
  
  videoURL = signal<string>('')
  previewURL = signal<string>('')
  isLoading = signal<boolean>(false)
  
  videoFile: File | null = null
  previewFile: File | null = null
  
  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>
  @ViewChild('previewInput') previewInput!: ElementRef<HTMLInputElement>

  private createVideoSubscription?: Subscription
  private worker: Worker

  constructor() {
    this.worker = new Worker(new URL('./file-reader.worker.ts', import.meta.url))
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
      
      this.videoService.createVideo({
        video: this.videoFile,
        name: this.videoForm.value.name!,
        description: this.videoForm.value.description || '',
        preview: this.previewFile
      }).subscribe({
        next: (event) => {           
            setTimeout(() => {
              this.isLoading.set(false)
              this.loaderService.hide()
              this.videoForm.reset()
              this.clearVideo()
              this.clearPreview()
            }, 500)
        },
        error: (error) => {
          this.loaderService.hide()
          this.isLoading.set(false)
        }
      })
    }
  }
}