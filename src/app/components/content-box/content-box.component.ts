import { Component, input } from '@angular/core';
import { VideoPreviewComponent } from "./content/video-preview/video-preview.component";
import { VideoInterface } from '../../interfaces/video/video';

@Component({
  selector: 'app-content-box',
  imports: [VideoPreviewComponent],
  templateUrl: './content-box.component.html',
  styleUrl: './content-box.component.scss',
})
export class ContentBoxComponent {
  contentType = input.required<number>()
  content = input.required<VideoInterface>()
}
