import {Component, computed, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoInterface } from '../../interfaces/video/video';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { ShortNumberPipe } from "../../pipes/short-number/short-number.pipe";
import { TimeAgoPipe } from "../../pipes/time-ago/time-ago-pipe.pipe";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PathConverterPipe } from "../../pipes/path-converter/path-converter.pipe";
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import {ShareService} from "../../services/share/share.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-video-view',
  imports: [ShortNumberPipe, TimeAgoPipe,
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
  totalLikes = signal<number>(0)
  isSubscribed = signal<boolean>(false)

  constructor(private routes: ActivatedRoute, private title: Title) {
    effect(() => {
      this.totalLikes.set(this.videoInformation()?.total_likes || 0)
    });
  }

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

  clickLikeButton(newStatus: 'liked' | 'disliked') {
    if (this.likedStatus() == newStatus) {
      this.likedStatus.set(null)
      this.totalLikes.update((v) => v - 1)
    } else {
      this.likedStatus.set(newStatus)
      this.totalLikes.update((v) => v + 1)
    }
  }

  shareVideo() {
    this.shareService.share()
  }
}
