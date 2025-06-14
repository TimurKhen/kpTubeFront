import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {VideoInterface} from "../../../../Interfaces/video-interface";
import { VideosFetchService } from '../../../../Services/videos-fetch.service';
import {DateService} from "../../../../Services/date.service";
import { NumbersFormaterService } from '../../../../Services/numbers-formater.service';

@Component({
  selector: 'app-statistic-sub-studio',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './statistic-sub-studio.component.html',
  styleUrl: './statistic-sub-studio.component.sass'
})
export class StatisticSubStudioComponent implements OnInit, OnDestroy  {
  VideosFetchService = inject(VideosFetchService)
  DateFetchService = inject(DateService)
  NumbersFormaterService = inject(NumbersFormaterService)

  userVideos: any = []
  status_of_last_video: string = 'Загрузка'

  @Input() userSubscribers: string = ''
  userTotalLikes: number = 0
  userTotalViews: number = 0

  animationInterval: any

  ngOnInit() {
    let user: string = ''

    if (localStorage) {
      user = String(localStorage.getItem('username'))
    }

    this.getSortedVideos(user)
  }

  ngOnDestroy(): void {
    clearInterval(this.animationInterval)
  }


  getSortedVideos(user: string) {
    this.VideosFetchService.getVideosByUser(user).subscribe((data: any) => {
      if (data.length == 0) {
        this.status_of_last_video = 'У вас нет видео!'
        return
      }

      data.forEach((d: any) => {
        this.userTotalLikes += Number(d.total_likes)
        this.userTotalViews += Number(d.views)
      })

      data.sort((a: any, b: any) => Number(b.total_likes) - Number(a.total_likes))
      data.forEach((video: VideoInterface) => {
        this.urlSetter(video)
      })
    })
  }

  NumberFormater(num: any): string {
    return this.NumbersFormaterService.setSimpleNumberValue(num)
  }

  urlSetter(response: any) {
    if (response.preview.startsWith('http://127.0.0.1:8000/')) {
      response.preview = response.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
    }

    this.userVideos.push(response)
  }

  getCreatedDate(video: any) {
    let current_date = new Date()
    let created_date = new Date(Number(video.Video_ID))
    return this.DateFetchService.getDateDifference(created_date, current_date)
  }
}
