import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoInterface } from '../../interfaces/video/video';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { ShortNumberPipe } from "../../pipes/short-number/short-number.pipe";
import { TimeAgoPipe } from "../../pipes/time-ago/time-ago-pipe.pipe";
import { NgClass } from '@angular/common';
import { CommentaryComponent } from "./commentary/commentary.component";
import { ProfilePreview } from '../../interfaces/profile/preview';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PathConverterPipe } from "../../pipes/path-converter/path-converter.pipe";
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import {ShareService} from "../../services/share/share.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-video-view',
  imports: [ShortNumberPipe, TimeAgoPipe, NgClass, CommentaryComponent,
    ReactiveFormsModule, VideoPlayerComponent, PathConverterPipe],
  templateUrl: './video-view.component.html',
  styleUrl: './video-view.component.scss',
})
export class VideoViewComponent implements OnInit, OnDestroy {
  private videoService = inject(VideosService)
  private userService = inject(UserService)
  private shareService = inject(ShareService)

  id = signal<string>('')
  videoInformation = signal<VideoInterface | undefined>(undefined)
  authorInformation = signal<ProfileInterface | undefined>(undefined)
  likedStatus = signal<'liked' | 'disliked' | null>(null)
  isShowComments = signal<boolean>(true)
  isSubscribed = signal<boolean>(false)
  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.minLength(1)])
  })

  constructor(private routes: ActivatedRoute, private title: Title) {}

  ngOnInit(): void {
    this.routes.paramMap.subscribe((data: any) => {
      this.id.set(data.params.id)
      this.getVideoInformation(data.params.id)
    })
  }

  ngOnDestroy(): void {
    this.userService.clearCache()
  }

  getVideoInformation(id: string) {
    this.videoService.getVideoByID(id)
      .subscribe((data: VideoInterface[]) => {
        this.videoInformation.set(
          data[0]
        )
        console.log(this.videoInformation())
        this.title.setTitle(this.videoInformation()?.name || 'KPTube')
        this.getAuthorInformation(data[0].owner)
        this.saveView()
      })
  }

  getAuthorInformation(authorName: string) {
    this.userService.getUserByName(authorName).subscribe((user) => {
      this.authorInformation.set(user[0])
    })
  }

  saveView() {
    this.videoService.saveView(this.videoInformation()?.Video_ID || '').subscribe()
  }

  createDate(date: string) {
    return new Date(+date)
  }

  // clickLikeButton(newStatus: 'liked' | 'disliked') {
  //   if (this.likedStatus() == newStatus) {
  //     this.likedStatus.set(null)
  //   } else {
  //     this.likedStatus.set(newStatus)
  //   }
  // }
  //
  // changeCurrentCommentsStatus() {
  //   this.isShowComments.update((val) => !val)
  // }
  //
  // changeSubscribeStatus() {
  //   this.isSubscribed.update((val) => !val)
  // }
  //
  // publishCommentary() {
  //   const values = this.commentForm.value
  //   this.commentForm.reset()
  // }
  shareVideo() {
    this.shareService.share()
  }
}
