import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {VideosPartComponent} from "./Videos_pages/videos-part/videos-part.component";
import {NavDesktopPartComponent} from "./Navigation/nav-desktop-part/nav-desktop-part.component";
import {SearchPartComponent} from "./search-part/search-part.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    VideosPartComponent, NavDesktopPartComponent,
    RouterLink, RouterOutlet, RouterModule, RouterLinkActive, SearchPartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  isHoverAccount = false
  timeOut: any
  userID: any
  constructor() {}

  setHoverStatus(status: boolean) {
    if (localStorage) {
      this.userID = localStorage.getItem('UserID')
    }

    if (!status) {
      this.timeOut = setTimeout(() => {
        this.isHoverAccount = status
      }, 200)
    } else {
      clearTimeout(this.timeOut)
      this.isHoverAccount = status
    }

  }

  exitAccount() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
      document.location.reload()
    }
  }
}
