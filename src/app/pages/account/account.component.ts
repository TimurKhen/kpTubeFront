import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { ProfilePreview } from '../../interfaces/profile/preview';
import { ShortNumberPipe } from '../../pipes/short-number/short-number.pipe';
import { NgClass } from '@angular/common';
import { AccountVideoComponent } from "../../components/account-video/account-video.component";
import { Video } from '../../interfaces/video/video';

@Component({
  selector: 'app-account',
  imports: [ShortNumberPipe, NgClass, AccountVideoComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
 private userService = inject(UserService)
  
  constructor(private routes: ActivatedRoute) {}

  id = signal<string>('')
  userInformation = signal<ProfileInterface | null>(null)
  isSubscribed = signal<boolean>(false)

  convertedVideos = computed<Video[]>(() => {
    const user = this.userInformation()
    if (!user) return []

    const author: ProfilePreview = {
      avatar: user.avatar,
      username: user.username,
      subscribers: user.subscribers
    }

    return user.videos.map(videoId => {
      return {
        id: videoId,
        title: `Video ${videoId}`,
        description: '',                      
        preview: `/templates/previews/teamplate_preview_${videoId}.jpg`,
        video: `/videos/video_${videoId}.mp4`, 
        author: author,
        views: 0,
        uploadDate: new Date(),
        comments: [],                        
        likes: 0,
        dislikes: 0,
        visibility: 0
      }
    })
  })

  ngOnInit(): void {
    this.routes.paramMap.subscribe((data: any) => {
      this.id.set(data.params.id)
      this.getProfileInformation(data.params.id)  
    })
  }

  getProfileInformation(id: string) {
    this.userService.getUserByID(id)
      .subscribe((val) => {
        this.userInformation.set(val)
      })
  }

  changeSubscribeStatus() {
    this.isSubscribed.update((val) => !val)
  }
}
