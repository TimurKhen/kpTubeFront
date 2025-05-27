import {Component, inject, OnInit} from '@angular/core'
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router'
import {HttpClient} from "@angular/common/http"
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common"
import {VideosFetchService} from "../../Services/videos-fetch.service"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {KpRatingComponent} from "../../KP-UI/kp-rating/kp-rating.component";
import {DateService} from "../../Services/date.service";
import {VideoInterface} from "../../Interfaces/video-interface";
import {StrShorterService} from '../../Services/str-shorter.service'
import {SystemIconsStylesDirective} from "../../Directives/system-icons-styles.directive";
import {LinkChangerService} from "../../Services/link-changer.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgStyle,
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgForOf,
    KpRatingComponent,
    SystemIconsStylesDirective
  ],
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  DateFetchService = inject(DateService)
  StrShorterService = inject(StrShorterService)
  LinkChangerService = inject(LinkChangerService)


  videoId: string = ''
  videoData: any = {}

  comments: any = []
  howMuchComments: number = 0

  userComment: string | null = null
  userName: string = ''
  userLikes: any
  usersSubscribes: any

  video_name: string = ''
  video_owner: string = ''
  video_category: string = ''
  video_description: string = ''
  video_preview_link: string = ''
  video_views: number = 0

  VideoData: any | null = null
  VideoOwnerId: string = ''

  author_photo_link: string = ''

  videoStars = 0
  video_link: string = ''

  is_description_open: boolean = false
  created_date: Date = new Date()
  isSubscribe: boolean = false
  author_subscribers: number = 0

  recommendations: VideoInterface[] = []

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.videoId = String(+params.get('Video_ID')!)
    })
    this.loadUserDetails()
    this.loadVideoDetails()
    this.loadRecommendations()
  }

  loadUserDetails(): void {
    if (localStorage) {
      this.userName = String(localStorage.getItem('username'))
      let userId = localStorage.getItem('UserID')

      if (this.userName !== null && userId !== null) {
        this.VideosFetchService.getUserByID(String(userId)).subscribe(
          (data: any) => {
            this.userLikes = data[0].liked
            this.usersSubscribes = data[0].subscribes
            this.loadStars()
            this.loadSubscribes()
            this.addToUserHistory()
          }
        )
      }
    }
  }

  loadVideoDetails(): void {
    if (this.videoId !== null) {
      this.http.get<any>(`https://kptube.kringeproduction.ru/videos/?Video_ID=${this.videoId}`).subscribe(data => {
        data[0].video = data[0].video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        data[0].preview = data[0].preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        this.getComments()
        this.VideoData = data[0]
        this.videoStars = data[0].likes
        this.video_link = data[0].video
        this.video_preview_link = data[0].preview
        this.video_name = data[0].name
        this.video_owner = data[0].owner
        this.video_category = data[0].category
        this.video_description = data[0].description
        this.video_views = data[0].views

        this.loadAuthorDetails()

        this.created_date = new Date(Number(this.videoId))
      })
    }
  }

  loadAuthorDetails() {
    this.VideosFetchService.enterUser(String(this.video_owner)).subscribe(
      (data: any) => {
        this.VideoOwnerId = String(data[0].User_ID)
        data[0].avatar = data[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        this.author_photo_link = data[0].avatar
        this.author_subscribers = data[0].subscribers
      }
    )
  }

  getComments() {
    this.http.get<any>(`https://kptube.kringeproduction.ru/comments/?Video_ID=${this.videoId}`).subscribe(commentsData => {
      this.comments = commentsData
      this.howMuchComments = 0
      commentsData.forEach((comment: any) => {
        this.howMuchComments += 1
      })
    })
  }

  addToUserHistory() {
    let userId = String(localStorage.getItem('UserID'))

    this.VideosFetchService.addView(userId, this.videoId).subscribe()
  }

  loadStars() {
    let getted_data_of_likes_value = this.userLikes[this.videoId]

    if (getted_data_of_likes_value !== undefined) {
      this.videoStars = Number(getted_data_of_likes_value)
    }
  }

  loadSubscribes() {
    let getted_data_of_subscribes = this.usersSubscribes[this.VideoOwnerId]

    if (getted_data_of_subscribes !== undefined) {
      this.isSubscribe = true
    }
  }


  commentOnVideo() {
    if (this.userName !== '' && this.videoId !== '') {
      this.VideosFetchService.createComment(String(this.userComment), this.videoId, this.userName).subscribe(
        response => {
          this.userComment = null
          this.getComments()
        }
      )
    }
  }

  cleaner() {
    this.userComment = null
  }


  get_created_date() {
    let current_date = new Date()
    return this.DateFetchService.getDateDifference(this.created_date, current_date)
  }

  change_description_status() {
    this.is_description_open = !this.is_description_open
  }


  subscribe_to_blogger_handler() {
    let userId = String(localStorage.getItem('UserID'))

    if (!this.isSubscribe) {
      this.VideosFetchService.subscribeToBlogger(userId, this.VideoOwnerId).subscribe((data) => {
        this.isSubscribe = true
      })
    } else {
      this.VideosFetchService.unSubscribeFromBlogger(userId, this.VideoOwnerId).subscribe((data) => {
        this.isSubscribe = false
      })
    }
  }

  loadRecommendations() {
    this.VideosFetchService.getVideos().subscribe((data: VideoInterface[]) => {
      let calcedVideos = []

      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        if (data[i].Video_ID === this.videoId) {
          calcedVideos.push(data[(randomIndex + 1) % data.length])
        } else {
          calcedVideos.push(data[randomIndex])
        }
      }

      calcedVideos.forEach((video: VideoInterface) => {
        video = this.LinkChangerService.videoLinksChanger(video)
        this.recommendations.push(video)
      })
    })
  }

  shorterStr(str: any) {
    return this.StrShorterService.shorterString(String(str), 25)
  }

  shareData = {
    title: "KPtube Video",
    text: this.videoData.name,
    url: '',
  }

  async shareInfo() {
    try {
      this.shareData = {
        title: String(this.video_name),
        text: this.video_description,
        url: `https://kptube.netlify.app/video/${this.videoId}`,
      }

      await navigator.share(this.shareData)
    } catch (err) {
    }
  }
}
