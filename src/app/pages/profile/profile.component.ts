import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { ContentBoxComponent } from "../../components/content-box/content-box.component";
import { ShortNumberPipe } from '../../pipes/short-number/short-number.pipe';
import { NgClass } from '@angular/common';
import { PathConverterPipe } from "../../pipes/path-converter/path-converter.pipe";
import { VideoPreview } from '../../interfaces/video/preview';
import { VideoInterface } from '../../interfaces/video/video';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { VideosGridComponent } from "../videos-grid/videos-grid.component";

@Component({
  selector: 'app-profile',
  imports: [ContentBoxComponent, RouterLink, ShortNumberPipe, NgClass, PathConverterPipe, VideosGridComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService)
  private videosService = inject(VideosService)
  
  constructor(private routes: ActivatedRoute) {}

  id = signal<string>('')
  userInformation = signal<ProfileInterface | null>(null)
  isSubscribed = signal<boolean>(false)

  userVideos = signal<VideoInterface[]>([])

  ngOnInit(): void {
    this.routes.paramMap.subscribe((data: any) => {
      this.id.set(data.params.id)
      this.getProfileInformation(data.params.id)  
    })
  }

  getProfileInformation(id: string) {
    this.userService.getUserByID(id)
      .subscribe((val: ProfileInterface[]) => {
        this.userInformation.set(val[0])
        console.log(val[0])
        this.getUserVideos(val[0].name)
      })
  }

  getUserVideos(username: string) {
    this.videosService.getVideosByUser(username).subscribe((videos: VideoInterface[]) => {
      this.userVideos.set(videos)
      console.log(videos)
    })
  }

  changeSubscribeStatus() {
    this.isSubscribed.update((val) => !val)
  }
}
