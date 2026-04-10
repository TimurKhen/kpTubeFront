import { Component, computed, inject, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { ContentBoxComponent } from "../../components/content-box/content-box.component";
import { RouterLink } from "@angular/router";
import { VideoInterface } from '../../interfaces/video/video';

@Component({
  selector: 'app-videos-grid',
  imports: [ContentBoxComponent, RouterLink],
  templateUrl: './videos-grid.component.html',
  styleUrl: './videos-grid.component.scss',
})
export class VideosGridComponent implements OnChanges {
  videoService = inject(VideosService)
  videosInput = input<VideoInterface[]>([])
  
  videos = signal<any[]>([])

  hasVideos = computed(() => (this.videos()?.length ?? 0) > 0);

  ngOnChanges(changes: SimpleChanges) {
    if (this.videosInput().length > 0) {
      this.videos.set(this.videosInput())
    }
  }

  ngOnInit() {
    if (this.videosInput().length > 0) {
      this.videos.set(this.videosInput())
    } else {
      this.videoService.getVideos().subscribe(data => {
        this.videos.set(data as VideoInterface[])
      })
    }
  }
}
