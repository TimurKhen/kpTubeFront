import { Component, inject, OnInit, signal } from '@angular/core';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { VideoPreview } from '../../interfaces/video/preview';
import { ContentBoxComponent } from "../../components/content-box/content-box.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-videos-grid',
  imports: [ContentBoxComponent, RouterLink],
  templateUrl: './videos-grid.component.html',
  styleUrl: './videos-grid.component.scss',
})
export class VideosGridComponent implements OnInit {
  videoService = inject(VideosService)
  videos = signal<VideoPreview[]>([])

  ngOnInit(): void {
    this.videos.set(this.videoService.videos)
  }

}
