import {Component, inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VideosFetchService} from '../../../../Services/videos-fetch.service';
import {VideoInterface} from "../../../../Interfaces/video-interface";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-main-sub-studio',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './main-sub-studio.component.html',
  styleUrl: './main-sub-studio.component.sass'
})
export class MainSubStudioComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  last_video: any
  user_data: any
  status_of_last_video: string = 'Загрузка'
  stars_count: number = 0

  ngOnInit() {
    let user: string = ''

    if (localStorage) {
      user = String(localStorage.getItem('username'))
    }

    this.getLastVideo(user)
    this.getAccountData(user)
  }

  getLastVideo(user: string) {
    this.VideosFetchService.getVideosByUser(user).subscribe((data: any) => {
      if (data.length == 0) {
        this.status_of_last_video = 'У вас нет видео!'
        return
      }
      data.sort((a: any, b: any) => Number(a.id) - Number(b.id))
      this.url_setter(data.at(-1))
    })
  }

  getAccountData(user: string) {
    this.VideosFetchService.enterUser(user).subscribe((data: any) => {
      this.user_data = data[0]
    })
  }

  url_setter(response: VideoInterface) {
    if (response.preview.startsWith('http://127.0.0.1:8000/')) {
      response.preview = response.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
    }
    this.last_video = response
    let values = Object.values(response.likes)
    let sum = values.reduce((acc, current) => acc + current, 0);

    this.stars_count = sum
    console.log(sum)
  }
}
