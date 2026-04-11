import { Component, computed, inject, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { ContentBoxComponent } from "../../components/content-box/content-box.component";
import { RouterLink } from "@angular/router";
import { VideoInterface } from '../../interfaces/video/video';
import { catchError, throwError } from 'rxjs';
import { LoaderIconComponent } from "../../services/loader/loader/loader-icon/loader-icon.component";

@Component({
  selector: 'app-videos-grid',
  imports: [ContentBoxComponent, RouterLink, LoaderIconComponent],
  templateUrl: './videos-grid.component.html',
  styleUrl: './videos-grid.component.scss',
})
export class VideosGridComponent implements OnChanges {
  videoService = inject(VideosService)
  videosInput = input<VideoInterface[]>([])
  
  videos = signal<any[]>([])

  isError = signal<boolean>(false)
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
      this.videoService.getVideos()
        .pipe(
          catchError((err) => {
            this.isError.set(true)
            return throwError(err)
          })
        )
        .subscribe(data => {
          console.log(data)
          this.videos.set(data as VideoInterface[])
        })
    }
  }
}
