import {Component, inject, OnInit} from '@angular/core';
import {VideosFetchService} from "../../Services/videos-fetch.service";
import {VideoInterface} from "../../Interfaces/video-interface";
import {SystemIconsStylesDirective} from "../../Directives/system-icons-styles.directive";
import {LinkChangerService} from "../../Services/link-changer.service";
import {NumbersFormaterService} from "../../Services/numbers-formater.service";

export let videos = []

@Component({
  selector: 'app-videos-part',
  standalone: true,
  imports: [
    SystemIconsStylesDirective,
  ],
  templateUrl: './videos-part.component.html',
  styleUrl: './videos-part.component.sass',
})
export class VideosPartComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  LinksChangerService = inject(LinkChangerService)
  NumbersFormaterService = inject(NumbersFormaterService)

  isServerOnline: boolean = true

  ngOnInit() {
    this.getVideos()
  }

  videos: VideoInterface[] = []

  getVideos() {
    this.VideosFetchService.getVideos().subscribe((data: any) => {
      data.filter((video: any) => video.isGlobal)
      data = this.shuffleArray(data)
      this.videos = data
    })
  }

  NumberFormater(num: any): string {
    return this.NumbersFormaterService.setSimpleNumberValue(num)
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
