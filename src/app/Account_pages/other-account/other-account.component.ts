import {Component, inject, OnInit} from '@angular/core'
import {VideosFetchService} from "../../Services/videos-fetch.service"
import {ActivatedRoute, RouterLink} from "@angular/router"
import {NgIf} from "@angular/common";
import { LinkChangerService } from '../../Services/link-changer.service';

@Component({
  selector: 'app-other-account',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './other-account.component.html',
  styleUrl: './other-account.component.sass'
})
export class OtherAccountComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  LinkChangerService = inject(LinkChangerService)

  userData: any[] = []
  userHeader: string | ArrayBuffer | null = null
  userAvatar: string | ArrayBuffer | null = null
  userName: string | null = null
  userSubscribers: number = 0

  videos: any[] = []

  UserID: number | null = null
  isCurrentUser: boolean = false

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.UserID = +params.get('User_ID')!
      this.loadVideoDetails()
      if (localStorage) {
        if (String(localStorage.getItem('UserID')) === String(this.UserID)) {
          this.isCurrentUser = true
        }
      }
    })
  }

  loadVideoDetails(): void {
    this.VideosFetchService.getUserByID(String(this.UserID)).subscribe(
      response => {
        let account = response[0]
        this.userData = account
        account = this.LinkChangerService.accountLinksChanger(account)

        this.userHeader = response[0].header
        this.userAvatar = response[0].avatar
        this.userName = response[0].name
        this.userSubscribers = response[0].subscribers
        this.loadOtherUserVideos()
      }
    )
  }

  loadOtherUserVideos(): void {
    this.VideosFetchService.getVideosByUser(String(this.userName)).subscribe((data: any) => {
      data.sort((a: any, b: any) => Number(a.id) - Number(b.id))
      data.forEach((video: any) => {
        if (video.isGlobal || this.isCurrentUser) {
          video = this.LinkChangerService.videoLinksChanger(video)
          this.videos.push(video)
        }
      })
      this.videos.reverse()
    })
  }
}
