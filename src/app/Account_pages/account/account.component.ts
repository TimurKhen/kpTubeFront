import {Component, inject, OnInit} from '@angular/core'
import {FormsModule} from "@angular/forms"
import {VideosFetchService} from "../../Services/videos-fetch.service"
import {NgIf} from "@angular/common"
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
    AccountStudioComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent {
  VideosFetchService = inject(VideosFetchService)
  http = inject(HttpClient)

  getUserID() {
    let usID = null
    let usNa = null

    if (typeof localStorage !== 'undefined') {
      usID = localStorage.getItem('UserID')
      usNa = localStorage.getItem('username')
    }

    console.log(usNa)
    return usID !== null && usNa !== null
  }
}
