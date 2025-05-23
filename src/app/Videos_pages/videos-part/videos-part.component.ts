import {AfterViewInit, Component, inject} from '@angular/core';
import {VideosFetchService} from "../../Services/videos-fetch.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {VideoInterface} from "../../Interfaces/video-interface";
import {filter, from} from "rxjs";
import {SystemIconsStylesDirective} from "../../Directives/system-icons-styles.directive";
import {AsyncPipe} from "@angular/common"

export let videos = []

@Component({
  selector: 'app-videos-part',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive,
    SystemIconsStylesDirective,
    AsyncPipe
  ],
  templateUrl: './videos-part.component.html',
  styleUrl: './videos-part.component.sass',
})
export class VideosPartComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.getVideos()
  }

  postService = inject(VideosFetchService)

  videos: VideoInterface[] = []

  constructor() {
  }

  getVideos() {
    this.postService.getVideos().subscribe((data: any) => {
      let rxjsArr = from(data)
      rxjsArr.pipe(
        filter((video: any) => video.isGlobal),
      ).subscribe(
        (d: any) => {
          this.renderVideo(d)
        }
      )
    })
  }

  renderVideo(video: any) {
    this.linksChanger(video)
    this.videos.push(video)
  }

  linksChanger(video: any) {
    if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
      video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
    }
    if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
      video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
    }
  }
}
