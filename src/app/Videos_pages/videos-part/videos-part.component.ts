import {AfterViewInit, Component, inject, Input, signal, Signal} from '@angular/core';
import {VideosFetchService} from "../../Services/videos-fetch.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {VideoInterface} from "../../Interfaces/video-interface";
import {SystemIconsStylesDirective} from "../../Directives/system-icons-styles.directive";
import {AsyncPipe} from "@angular/common"
import {LinkChangerService} from "../../Services/link-changer.service";

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
  postService = inject(VideosFetchService)
  LinksChangerService = inject(LinkChangerService)

  ngAfterViewInit() {
    this.getVideos()
  }

  videos: VideoInterface[] = []

  getVideos() {
    this.postService.getVideos().subscribe((data: any) => {
      data.filter((video: any) => video.isGlobal)
      data = this.shuffleArray(data)
      this.videos = data
    })
  }

  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length
    let randomIndex

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }

    return array
  }


  linksChanger(link: any) {
    return this.LinksChangerService.linkChanger(link)
  }
}
