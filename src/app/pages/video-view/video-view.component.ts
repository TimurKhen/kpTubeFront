import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../interfaces/video/video';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { ShortNumberPipe } from "../../pipes/short-number/short-number.pipe";
import { TimeAgoPipe } from "../../pipes/time-ago/time-ago-pipe.pipe";
import { NgClass } from '@angular/common';
import { CommentaryComponent } from "./commentary/commentary.component";
import { ProfilePreview } from '../../interfaces/profile/preview';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-video-view',
  imports: [ShortNumberPipe, TimeAgoPipe, NgClass, CommentaryComponent, ReactiveFormsModule],
  templateUrl: './video-view.component.html',
  styleUrl: './video-view.component.scss',
})
export class VideoViewComponent implements OnInit {
  videoService = inject(VideosService) 

  id = signal<string>('')
  videoInformation = signal<Video | undefined>(undefined)
  likedStatus = signal<'liked' | 'disliked' | null>(null)
  isShowComments = signal<boolean>(true)
  currentUserData = signal<ProfilePreview>({
    avatar: './templates/template_avatar.jpg',
    username: 'TimurKhen',
    subscribers: 13
  })

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.minLength(1)])
  })

  constructor(private routes: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.routes.paramMap.subscribe((data: any) => {
      this.id.set(data.params.id)
      this.getVideoInformation(data.params.id)  
    })
  }

  getVideoInformation(id: string) {
    this.videoService.getVideoByID(id)
      .subscribe((data: Video) => {
        this.videoInformation.set(
          data
        )
      })
  }

  clickLikeButton(newStatus: 'liked' | 'disliked') {
    this.likedStatus.set(newStatus)
  }

  changeCurrentCommentsStatus() {
    this.isShowComments.update((val) => !val)
  }
}
