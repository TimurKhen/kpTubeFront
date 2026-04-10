import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuOpenerComponent } from "./menu-opener/menu-opener.component";
import { RouterLink } from "@angular/router";
import { SideBarHandlerService } from '../../services/side-bar-handler/side-bar-handler.service';
import { VideosService } from '../../services/videos-service/videos-service.service';
import { UserService } from '../../services/user-service/user-service.service';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { PathConverterPipe } from "../../pipes/path-converter/path-converter.pipe";

@Component({
  selector: 'navigation',
  imports: [MenuOpenerComponent, ReactiveFormsModule, RouterLink, PathConverterPipe],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  private userService = inject(UserService) 

  userInformation = signal<ProfileInterface | null>(null)

  searchForm = new FormControl('', [Validators.required, Validators.minLength(1)])
  sideBarService = inject(SideBarHandlerService)
  videoService = inject(VideosService)

  constructor() {
    effect(() => {
      this.userInformation.set(this.userService.userData())
    })
  }
 
  ngOnInit(): void {
    this.userService.loadUserData()
  }

  changeStatusOfOpen($event: boolean) {
    this.sideBarService.isSideBarOpen.set($event)
  }

  search() {
    // searchVideos method is not yet implemented
  }
}
