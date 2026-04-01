import { Component, inject, OnInit, signal } from '@angular/core';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { ContentBoxComponent } from "../../components/content-box/content-box.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-videos-grid',
  imports: [ContentBoxComponent, RouterLink],
  templateUrl: './videos-grid.component.html',
  styleUrl: './videos-grid.component.scss',
})
export class VideosGridComponent {
  videoService = inject(VideosService)
  videos = this.videoService.videos
}
