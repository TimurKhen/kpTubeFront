import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader/loader.service';
import { UserService } from '../../services/user-service/user-service.service';
import { AlertService } from '../../services/alert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit, OnDestroy {
  private userService = inject(UserService)
  private loaderService = inject(LoaderService)
  private alertService = inject(AlertService)
  private router = inject(Router)

  registerForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    avatar: new FormControl<File | null>(null, Validators.required),
    header: new FormControl<File | null>(null, Validators.required)
  })

  avatarUrl = signal<string>('')
  headerUrl = signal<string>('')
  isRegistrationRequestNow = signal<boolean>(false)

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>
  @ViewChild('headerInput') headerInput!: ElementRef<HTMLInputElement>

  private registerSubscription?: Subscription
  private worker: Worker

  ngOnInit() {
    this.userService.logout(false)
  }

  constructor() {
    this.worker = new Worker(new URL('../../services/workers/file-reader.worker.ts', import.meta.url))
    this.worker.onmessage = (event) => {
      const { blob, fileName, error } = event.data
      if (error) {
        console.error('Worker error:', error)
        return
      }

      const currentAvatar = this.registerForm.get('avatar')?.value
      const currentHeader = this.registerForm.get('header')?.value

      if (currentAvatar && fileName === currentAvatar.name) {
        if (this.avatarUrl()) {
          URL.revokeObjectURL(this.avatarUrl())
        }
        this.avatarUrl.set(URL.createObjectURL(blob))
      } else if (currentHeader && fileName === currentHeader.name) {
        if (this.headerUrl()) {
          URL.revokeObjectURL(this.headerUrl())
        }
        this.headerUrl.set(URL.createObjectURL(blob))
      }
    }
  }

  avatarCreate(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.registerForm.patchValue({ avatar: file })
      this.worker.postMessage({ file: file, action: 'processFile' })
    }
  }

  headerCreate(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.registerForm.patchValue({ header: file })
      this.worker.postMessage({ file: file, action: 'processFile' })
    }
  }

  ngOnDestroy(): void {
    this.registerSubscription?.unsubscribe()
    this.worker.terminate()
    if (this.avatarUrl()) {
      URL.revokeObjectURL(this.avatarUrl())
    }
    if (this.headerUrl()) {
      URL.revokeObjectURL(this.headerUrl())
    }
  }

  clearAvatar() {
    if (this.avatarUrl()) {
      URL.revokeObjectURL(this.avatarUrl())
    }
    this.avatarUrl.set('')
    this.registerForm.patchValue({ avatar: null })
    if (this.avatarInput) {
      this.avatarInput.nativeElement.value = ''
    }
  }

  clearHeader() {
    if (this.headerUrl()) {
      URL.revokeObjectURL(this.headerUrl())
    }
    this.headerUrl.set('')
    this.registerForm.patchValue({ header: null })
    if (this.headerInput) {
      this.headerInput.nativeElement.value = ''
    }
  }

  async onRegister($event: Event) {
    $event.preventDefault()

    if (this.registerForm.valid) {
      this.isRegistrationRequestNow.set(true)
      await this.loaderService.show(signal<string>('Регистрация пользователя...'))

      const formData = new FormData()
      formData.append('User_ID', String(Number(new Date)))
      formData.append('username', this.registerForm.get('username')?.value || '')
      formData.append('password', this.registerForm.get('password')?.value || '')
      formData.append('email', this.registerForm.get('email')?.value || '')

      const avatar = this.registerForm.get('avatar')?.value
      const header = this.registerForm.get('header')?.value

      if (avatar) {
        formData.append('avatar', avatar)
      }
      if (header) {
        formData.append('header', header)
      }

      this.registerSubscription = this.userService.register(formData).subscribe({
        next: (response) => {
          this.userService.send_email(this.registerForm.get('email')?.value || '').subscribe()
          this.userService.enterUser(this.registerForm.get('username')?.value || '', this.registerForm.get('password')?.value || '').subscribe(
            (val) => {
              this.isRegistrationRequestNow.set(false)
              this.loaderService.hide()
              this.registerForm.reset()
              this.clearAvatar()
              this.clearHeader()

              this.router.navigate(['/'])
              this.userService.loadUserData()
              this.alertService.show(
                'Подтвердите ваш аккаунт через почту.',
                '',
                false
              )
            }
          )

        },
        error: (error) => {
          this.loaderService.hide()
          this.isRegistrationRequestNow.set(false)
          this.alertService.show(
            'Ошибка при регстрации',
            error.status,
            true
          )
        }
      })
    }
  }
}
