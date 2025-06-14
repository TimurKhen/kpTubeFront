import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VideosFetchService} from '../../../../Services/videos-fetch.service';
import {VideoInterface} from "../../../../Interfaces/video-interface";
import {AsyncPipe} from "@angular/common";
import {DateService} from "../../../../Services/date.service";
import {RouterLink} from "@angular/router";
import { NumbersFormaterService } from '../../../../Services/numbers-formater.service';

@Component({
  selector: 'app-main-sub-studio',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './main-sub-studio.component.html',
  styleUrl: './main-sub-studio.component.sass'
})
export class MainSubStudioComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  DateFetchService = inject(DateService)
  NumbersFormaterService = inject(NumbersFormaterService)

  last_video: any
  status_of_last_video: string = 'Загрузка'
  stars_count: number = 0
  created_date: Date = new Date()

  @Input() userSubscribers: string = ''
  @Output() userClickEvent = new EventEmitter()

  ngOnInit() {
    let user: string = ''

    if (localStorage) {
      user = String(localStorage.getItem('username'))
    }

    this.getLastVideo(user)
  }

  getLastVideo(user: string) {
    this.VideosFetchService.getVideosByUser(user).subscribe((data: any) => {
      if (data.length == 0) {
        this.status_of_last_video = 'У вас нет видео!'
        return
      }
      data.sort((a: any, b: any) => Number(a.id) - Number(b.id))
      this.urlSetter(data.at(-1))
    })
  }

  NumberFormater(num: any): string {
    return this.NumbersFormaterService.setSimpleNumberValue(num)
  }

  urlSetter(response: VideoInterface) {
    if (response.preview.startsWith('http://127.0.0.1:8000/')) {
      response.preview = response.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
    }
    this.last_video = response
    this.stars_count = Number(response.total_likes)
    this.created_date = new Date(Number(response.Video_ID))
  }

  getCreatedDate() {
    let current_date = new Date()
    return this.DateFetchService.getDateDifference(this.created_date, current_date)
  }

  clickToStatisticButton() {
    this.userClickEvent.emit()
  }
}
