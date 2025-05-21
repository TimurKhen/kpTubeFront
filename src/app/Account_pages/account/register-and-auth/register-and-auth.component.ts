import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {VideosFetchService} from "../../../Services/videos-fetch.service"
import {NgIf} from "@angular/common"
import {HttpClient} from "@angular/common/http"


@Component({
  selector: 'app-register-and-auth',
  standalone: true,
    imports: [
        FormsModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './register-and-auth.component.html',
  styleUrl: './register-and-auth.component.sass'
})
export class RegisterAndAuthComponent {
  VideosFetchService = inject(VideosFetchService)
  http = inject(HttpClient)

  name: string = ''
  email: string = ''
  password: string = ''
  avatar: File | any
  header: File | any
  avatarUrl: string | ArrayBuffer | null = null
  headerUrl: string | ArrayBuffer | null = null

  enterName: string = ''
  enterPass: string = ''

  errorMessage: string | null = null

  register: boolean = false

  is_registration_request_now: boolean = false
  popup_open: boolean = false
  is_error: boolean = false
  timeout: any | null = null


  avatarCreate(event: any): void {
    if (event.target.files.length > 0) {
      this.avatar = event.target.files[0]
      const file = event.target.files[0]
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()
        reader.onload = () => {
          this.avatarUrl = reader.result
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите изображение.'
        this.popup_open = true
        this.is_error = true
      }
    }
  }

  headerCreate(event: any): void {
    if (event.target.files.length > 0) {
      this.header = event.target.files[0]
      const file = event.target.files[0]
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()
        reader.onload = () => {
          this.headerUrl = reader.result
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите изображение.'
        this.popup_open = true
        this.is_error = true
      }
    }
  }

  onRegister() {
    let userID = String(Number(new Date))
    this.is_registration_request_now = true

    this.VideosFetchService.createUser(String(userID), this.name, this.email, this.password, this.avatar, this.header).subscribe(
      response => {
        if (localStorage) {
          localStorage.setItem('UserID', String(userID))
          localStorage.setItem('username', String(this.name))
          localStorage.setItem('password', String(this.password))
          this.popup_open = true
          this.VideosFetchService.send_email(this.email).subscribe()
          this.timeout = setTimeout(() => {
            location.reload()
          }, 60000)
        }
      },
      (e) => {
        this.errorMessage = String(e.message)
        this.popup_open = true
        this.is_error = true
      }
    )
  }

  onEnter() {
    localStorage.setItem('username', this.enterName)
    localStorage.setItem('password', this.enterPass)

    this.VideosFetchService.enterUser(String(this.enterName)).subscribe(
      response => {
        let userID = response[0].User_ID
        localStorage.setItem('UserID', userID)

        location.reload()
      },
      error => {
        console.log(error)
        this.errorMessage = 'Неверный логин или пароль'
        this.popup_open = true
        this.is_error = true
      }
    )
  }

  change_method() {
    this.register = !this.register
  }

  close_pop_up() {
    this.popup_open = false
    this.is_error = false
    if (this.timeout != null) {
      clearTimeout(this.timeout)
      location.reload()
    }
    this.timeout = null
  }
}
