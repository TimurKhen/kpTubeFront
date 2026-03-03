import {Component, inject, OnInit} from '@angular/core'
import {FormsModule} from "@angular/forms"
import {VideosFetchService} from "../../Services/videos-fetch.service"
import {NgClass} from "@angular/common";
import {RegisterAndAuthComponent} from "./register-and-auth/register-and-auth.component";
import {AccountStudioComponent} from "./account-studio/account-studio.component";

@Component({
  selector: 'app-account',
  imports: [
    FormsModule,
    RegisterAndAuthComponent,
    AccountStudioComponent,
    NgClass
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)
  isAuth: boolean = false
  isRendered: boolean = false
  isServerOnline: boolean = false

  ngOnInit() {
    this.VideosFetchService.checkIsServerOnline().subscribe((data: any) => {
      this.isServerOnline = data.ok()
    })

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
