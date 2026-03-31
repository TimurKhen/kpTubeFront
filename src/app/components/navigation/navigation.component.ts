import { Component, inject, signal } from '@angular/core';
import { ProfilePreview } from '../../interfaces/profile/preview';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuOpenerComponent } from "./menu-opener/menu-opener.component";
import { RouterLink } from "@angular/router";
import { SideBarHandlerService } from '../../services/side-bar-handler/side-bar-handler.service';
import { VideosService } from '../../services/videos-service/videos-service.service';

@Component({
  selector: 'navigation',
  imports: [MenuOpenerComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  userInformation = signal<ProfilePreview>({
    avatar: './templates/template_avatar.jpg',
    username: 'TimurKhen',
    subscribers: 123
  })

  searchForm = new FormControl('', [Validators.required, Validators.minLength(1)])
  sideBarService = inject(SideBarHandlerService)
  videoService = inject(VideosService)

  changeStatusOfOpen($event: boolean) {
    this.sideBarService.isSideBarOpen.set($event)
  }

  search() {
    if (this.searchForm.value) {
      this.videoService.searchVideos(this.searchForm.value).subscribe()
    }
  }
}
