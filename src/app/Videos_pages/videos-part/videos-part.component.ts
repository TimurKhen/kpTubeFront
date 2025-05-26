import {AfterViewInit, Component, inject} from '@angular/core';
import {VideosFetchService} from "../../Services/videos-fetch.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {VideoInterface} from "../../Interfaces/video-interface";
import {filter, from, of, startWith, Subject} from "rxjs";
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
      data.filter((video: any) => video.isGlobal)
      this.videos = data
    })
  }

  linksChanger(link: any) {
    if (link.startsWith('http://127.0.0.1:8000/')) {
      link = link.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
    }
    return link
  }
}
