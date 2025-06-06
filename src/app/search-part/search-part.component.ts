import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {VideosFetchService} from "../Services/videos-fetch.service";
import {FormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";
import {SystemIconsStylesDirective} from '../Directives/system-icons-styles.directive'
import * as timers from "node:timers";

@Component({
  selector: 'app-search-part',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    NgStyle,
    NgIf,
    SystemIconsStylesDirective
  ],
  templateUrl: './search-part.component.html',
  styleUrl: './search-part.component.sass'
})
export class SearchPartComponent implements OnInit {
  userAvatar: string | null = null
  userInput: string = ''
  userID: any
  isInputDisabled: boolean = false
  isMobile: boolean = false

  isServerOnline: boolean = false
  isUserHaveAccount: boolean = false
  @Output() hoverOnAccount = new EventEmitter<boolean>()

  constructor(private router: Router) {
  }

  VideosFetchService = inject(VideosFetchService)


  ngOnInit() {
    if (typeof localStorage !== undefined) {
      this.userID = String(localStorage.getItem('UserID'))
    }
    this.getUserAvatar()
  }

  setHoverStatus(status: boolean) {
    this.hoverOnAccount.emit(status)
  }

  getUserAvatar() {
    this.VideosFetchService.getUserByID(this.userID).subscribe(
      (response): any => {
        if (response == null) {
          this.isServerOnline = false
          return
        }

        this.isServerOnline = true

        if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
          response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
          this.userAvatar = response[0].avatar
        }
      },
      (error): any => {
        this.isServerOnline = false
      }
    )
    this.isLogin()
  }

  isLogin() {
    let isInLS = (localStorage.getItem('username') !== null) && (localStorage.getItem('UserID') !== null)
    this.isUserHaveAccount = isInLS
  }

  onSearch(): void {
    if (this.userInput.trim()) {
      this.router.navigate(['/search', this.userInput])
    }
  }

  onResize(event: any) {
    this.checkScreenSize(event.target.innerWidth)
  }

  checkScreenSize(width: number) {
    this.isMobile = width <= 650
    this.isInputDisabled = width < 650
  }

  searchIconClick() {
    this.isInputDisabled = !this.isInputDisabled
  }
}
