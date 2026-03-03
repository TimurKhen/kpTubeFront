import {Component} from '@angular/core';
import {RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {NavDesktopPartComponent} from "./Navigation/nav-desktop-part/nav-desktop-part.component";
import {SearchPartComponent} from "./search-part/search-part.component";

@Component({
  selector: 'app-root',
  imports: [NavDesktopPartComponent, RouterLink, RouterOutlet, RouterModule, SearchPartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent {
  isHoverAccount = false
  timeOut: any
  userID: any

  constructor() {
  }

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
