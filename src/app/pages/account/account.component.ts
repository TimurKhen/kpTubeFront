import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { ShortNumberPipe } from '../../pipes/short-number/short-number.pipe';
import { NgClass } from '@angular/common';
import { AccountVideoComponent } from "../../components/account-video/account-video.component";
import { VideoInterface } from '../../interfaces/video/video';
import {PathConverterPipe} from "../../pipes/path-converter/path-converter.pipe";
import {VideosService} from "../../services/videos-service/videos-service.service";
import {AcceptService} from "../../services/accept/accept.service";

@Component({
  selector: 'app-account',
  imports: [ShortNumberPipe, NgClass, AccountVideoComponent, PathConverterPipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  private userService = inject(UserService)
  private videosService = inject(VideosService)
  private acceptService = inject(AcceptService)

  id = signal<string>('')
  userInformation = signal<ProfileInterface | null>(null)
  userVideos = signal<VideoInterface[]>([])

  constructor() {
    effect(() => {
      this.userInformation.set(this.userService.userData())
      this.getUserVideos(this.userInformation()?.username || '')
    })
  }

  ngOnInit(): void {
    this.userService.loadUserData()
  }

  exitAccount() {
    this.acceptService.show(
      'Выйти из аккаунта?',
      'Вы уверены, что вы хотите выйти?',
      '/icons/exit-icon.svg'
    ).subscribe((val) => {
      if (val === 0) {
        this.userService.logout()
      }
    })
  }

  getUserVideos(username: string) {
    if (username === '') return
    this.videosService.getVideosByUser(username).subscribe((videos: VideoInterface[]) => {
      this.userVideos.set(videos)
    })
  }
}
