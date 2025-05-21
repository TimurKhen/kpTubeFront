import {Component, inject, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { VideosFetchService } from '../../../../Services/videos-fetch.service';

@Component({
  selector: 'app-settings-sub-studio',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './settings-sub-studio.component.html',
  styleUrl: './settings-sub-studio.component.sass'
})
export class SettingsSubStudioComponent {
  VideosFetchService = inject(VideosFetchService)

  @Input() user: any
  @Input() currAvatarImage: string | ArrayBuffer | null = ''
  @Input() currHeaderImage: string | ArrayBuffer | null = ''

  popup_open: boolean = false
  is_error: boolean = false
  errorMessage: string = ''

  avatar: File | any
  header: File | any

  is_avatar_changed: boolean = false
  is_header_changed: boolean = false

  avatarGet(event: any): void {
    if (event.target.files.length > 0) {
      this.avatar = event.target.files[0]
      const file = event.target.files[0]
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()
        reader.onload = () => {
          this.currAvatarImage = reader.result
          this.is_avatar_changed = true
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите изображение.'
        this.popup_open = true
        this.is_error = true
      }
    }
  }

  headerGet(event: any): void {
    if (event.target.files.length > 0) {
      this.header = event.target.files[0]
      const file = event.target.files[0]
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()
        reader.onload = () => {
          this.currHeaderImage = reader.result
          this.is_header_changed = true
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите изображение.'
        this.popup_open = true
        this.is_error = true
      }
    }
  }

  applyAvatarSet() {
    if (this.is_avatar_changed) {
      let changedUser = this.user
      this.VideosFetchService.changeUserData(changedUser,
        this.avatar, changedUser.header).subscribe((data) => {
        console.log(data)
      })
      this.is_avatar_changed = false
    }
  }

  applyHeaderSet() {
    if (this.is_header_changed) {
      let changedUser = this.user
      changedUser.header = this.header
      this.VideosFetchService.changeUserData(changedUser,
        changedUser.avatar, this.header).subscribe((data) => {
        console.log(data)
      })
      this.is_header_changed = false
    }
  }

  close_pop_up() {
    this.popup_open = false
    this.is_error = false
  }
}
