import {Component, inject, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {VideosFetchService} from '../../../Services/videos-fetch.service';
import {MainSubStudioComponent} from "./main-sub-studio/main-sub-studio.component";

@Component({
  selector: 'app-account-studio',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgClass,
    MainSubStudioComponent
  ],
  templateUrl: './account-studio.component.html',
  styleUrl: './account-studio.component.sass'
})
export class AccountStudioComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  http = inject(HttpClient)

  name: string = ''
  email: string = ''
  password: string = ''
  avatar: File | any
  header: File | any

  userData: any[] = []
  userHeader: string | ArrayBuffer | null = null
  userAvatar: string | ArrayBuffer | null = null
  userName: string = ''
  userVideos: any[] = []
  usName: any | null = null
  userSubscribers: string = '0'

  currentSubStudioNumber: number = 0

  set_sub_studio_number(value: number) {
    this.currentSubStudioNumber = value
  }

  ngOnInit() {
    this.url_setter()
  }

  url_setter() {
    if (typeof localStorage !== 'undefined') {
      this.usName = localStorage.getItem('username')
    }
    this.VideosFetchService.enterUser(String(this.usName)).subscribe(
      response => {
        if (response[0].header.startsWith('http://127.0.0.1:8000/')) {
          response[0].header = response[0].header.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
          this.userHeader = response[0].header
        }


        if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
          response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
          this.userAvatar = response[0].avatar
        }

        this.userName = response[0].name
        this.userSubscribers = response[0].subscribers
      }
    )
  }
}
