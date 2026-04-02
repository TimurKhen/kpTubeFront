import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { ContentBoxComponent } from "../../components/content-box/content-box.component";
import { VideoPreview } from '../../interfaces/video/preview';
import { ProfilePreview } from '../../interfaces/profile/preview';
import { ShortNumberPipe } from '../../pipes/short-number/short-number.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [ContentBoxComponent, RouterLink, ShortNumberPipe, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private userService = inject(UserService)
  
  constructor(private routes: ActivatedRoute) {}

  id = signal<string>('')
  userInformation = signal<ProfileInterface | null>(null)
  isSubscribed = signal<boolean>(false)

  convertedVideos = computed<VideoPreview[]>(() => {
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
        preview: `/templates/previews/teamplate_preview_${videoId}.jpg`, 
        author: author,
        views: 0,                         
        uploadDate: new Date()            
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
