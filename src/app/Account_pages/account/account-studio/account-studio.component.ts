import {Component, inject, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {VideosFetchService} from '../../../Services/videos-fetch.service';
import {MainSubStudioComponent} from "./main-sub-studio/main-sub-studio.component";
import {StatisticSubStudioComponent} from "./statistic-sub-studio/statistic-sub-studio.component";
import {SettingsSubStudioComponent} from "./settings-sub-studio/settings-sub-studio.component";
import { LinkChangerService } from '../../../Services/link-changer.service';

@Component({
  selector: 'app-account-studio',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgClass,
    MainSubStudioComponent,
    StatisticSubStudioComponent,
    SettingsSubStudioComponent
  ],
  templateUrl: './account-studio.component.html',
  styleUrl: './account-studio.component.sass'
})
export class AccountStudioComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  LinkChangerService = inject(LinkChangerService)

  name: string = ''
  email: string = ''
  password: string = ''
  avatar: File | any
  header: File | any

  userHeader: string | ArrayBuffer = ''
  userAvatar: string | ArrayBuffer = ''
  userName: string = ''
  usName: any | null = null
  userSubscribers: string = '0'

  currentSubStudioNumber: number = 0
  user: any

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
        let account = response[0]
        this.user = account

        account = this.LinkChangerService.accountLinksChanger(account)

        this.userAvatar = account.avatar
        this.userHeader = account.header
        this.userName = account.name
        this.userSubscribers = account.subscribers
      }
    )
  }
}
