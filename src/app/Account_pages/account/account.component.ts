import {Component, inject, OnInit} from '@angular/core'
import {FormsModule} from "@angular/forms"
import {VideosFetchService} from "../../Services/videos-fetch.service"
import {NgClass, NgIf, NgStyle} from "@angular/common"
import {RouterLink} from "@angular/router"
import {HttpClient} from "@angular/common/http"
import {RegisterAndAuthComponent} from "./register-and-auth/register-and-auth.component";
import {AccountStudioComponent} from "./account-studio/account-studio.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    RegisterAndAuthComponent,
    AccountStudioComponent,
    NgStyle,
    NgClass
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  isAuth: boolean = false
  isRendered: boolean = false

  ngOnInit() {
    this.getUserID().then(() => {
      this.isRendered = true
    })
  }

  async getUserID() {
    let usID = null
    let usNa = null

    if (typeof localStorage !== 'undefined') {
      usID = localStorage.getItem('UserID')
      usNa = localStorage.getItem('username')
    }

    this.isAuth = usID !== null && usNa !== null
    return usID !== null && usNa !== null
  }

}
