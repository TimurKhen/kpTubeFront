import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { ShortNumberPipe } from '../../pipes/short-number/short-number.pipe';
import { NgClass } from '@angular/common';
import { AccountVideoComponent } from "../../components/account-video/account-video.component";
import { VideoInterface } from '../../interfaces/video/video';

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
