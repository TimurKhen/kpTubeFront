import { Component, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoPlayerComponent } from "../video-view/video-player/video-player.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-video-create',
  imports: [ReactiveFormsModule, VideoPlayerComponent, NgClass],
  templateUrl: './video-create.component.html',
  styleUrl: './video-create.component.scss',
})
export class VideoCreateComponent implements OnDestroy {
  videoForm = new FormGroup({
    video: new FormControl<File | null>(null, [Validators.required]),
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    preview: new FormControl<File | null>(null, [Validators.required]),
  })
  videoURL = signal<string>('')
  previewURL = signal<string>('')

  onVideoChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const videoFile = input.files[0]
      this.videoURL.set(URL.createObjectURL(videoFile))
      this.videoForm.patchValue({ video: videoFile })
    }
  }

  onPreviewChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const previewFile = input.files[0]
      this.previewURL.set(URL.createObjectURL(previewFile))
      this.videoForm.patchValue({ preview: previewFile })
    }
  }

  ngOnDestroy(): void {
    if (this.videoURL()) {
      URL.revokeObjectURL(this.videoURL())
      URL.revokeObjectURL(this.previewURL())
    }
  }

  clearVideo() {
    URL.revokeObjectURL(this.videoURL())
    this.videoURL.set('')
    this.videoForm.patchValue({ video: null })
  }

  clearPreview() {
    URL.revokeObjectURL(this.previewURL())
    this.previewURL.set('')
    this.videoForm.patchValue({ preview: null })
  }
}
