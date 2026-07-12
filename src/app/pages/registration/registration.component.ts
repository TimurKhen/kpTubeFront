import {Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {LoaderService} from '../../services/loader/loader.service';
import {UserService} from '../../services/user-service/user-service.service';
import {AlertService} from '../../services/alert/alert.service';
import {Router} from '@angular/router';
import {email, form, FormField, minLength, required} from "@angular/forms/signals";

interface Register {
  username: string;
  password: string;
  email: string;
  avatar: File | null;
  header: File | null;
}

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit, OnDestroy {
  avatarUrl = signal<string>('')
  headerUrl = signal<string>('')
  isRegistrationRequestNow = signal<boolean>(false)
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>
  @ViewChild('headerInput') headerInput!: ElementRef<HTMLInputElement>
  private userService = inject(UserService)
  private loaderService = inject(LoaderService)
  private alertService = inject(AlertService)
  private router = inject(Router)
  private registerData = signal<Register>({
    username: '', password: '', email: '', avatar: null, header: null,
  })
  registerForm = form(this.registerData, (schema) => {
    required(schema.username)
    required(schema.password, {message: 'Пароль обязателен'})
    minLength(schema.password, 8, {message: 'Минимальная длина 8'})
    required(schema.email, {message: 'Email обязателен'})
    email(schema.email, {message: 'Введите корректный Email'})
    required(schema.avatar)
    required(schema.header)
  })
  private registerSubscription?: Subscription
  private worker: Worker

  constructor() {
    this.worker = new Worker(new URL('../../services/workers/file-reader.worker.ts', import.meta.url))
    this.worker.onmessage = (event) => this.onWorkerMessage(event)
  }

  onWorkerMessage(event: MessageEvent<any>) {
    const {blob, fileName, target, error} = event.data
    if (error) {
      console.error('Worker error:', error)
      return
    }

    const currentAvatar = this.registerForm.avatar().value()
    const currentHeader = this.registerForm.header().value()

    if (currentAvatar && target === 'avatar') {
      if (this.avatarUrl()) {
        URL.revokeObjectURL(this.avatarUrl())
      }
      this.avatarUrl.set(URL.createObjectURL(blob))
    } else if (currentHeader && target === 'header') {
      if (this.headerUrl()) {
        URL.revokeObjectURL(this.headerUrl())
      }
      this.headerUrl.set(URL.createObjectURL(blob))
    }
  }

  ngOnInit() {
    this.userService.logout(false)
  }

  avatarCreate(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.worker.postMessage({file: file, action: 'processFile', target: 'avatar'})
      this.registerForm.avatar().value.set(file)
    }
  }

  headerCreate(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.worker.postMessage({file: file, action: 'processFile', target: 'header'})
      this.registerForm.header().value.set(file)
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
    this.registerForm.avatar().value.set(null)
    if (this.avatarInput) {
      this.avatarInput.nativeElement.value = ''
    }
  }

  clearHeader() {
    if (this.headerUrl()) {
      URL.revokeObjectURL(this.headerUrl())
    }
    this.headerUrl.set('')
    this.registerForm.header().value.set(null)
    if (this.headerInput) {
      this.headerInput.nativeElement.value = ''
    }
  }

  async onRegister($event: Event) {
    $event.preventDefault()

    if (this.registerForm) {
      this.isRegistrationRequestNow.set(true)
      await this.loaderService.show(signal<string>('Регистрация пользователя...'))

      const formData = new FormData()
      formData.append('User_ID', String(Number(new Date)))
      formData.append('username', this.registerData().username)
      formData.append('password', this.registerData().password)
      formData.append('email', this.registerData().email)

      const avatar = this.registerData().avatar
      const header = this.registerData().header

      if (avatar) {
        formData.append('avatar', avatar)
      }
      if (header) {
        formData.append('header', header)
      }

      this.registerSubscription = this.userService.register(formData).subscribe({
        next: (response) => {
          this.userService.send_email(this.registerData().email).subscribe()
          this.userService.enterUser(this.registerData().username, this.registerData().password)
            .subscribe((val) => {
              this.isRegistrationRequestNow.set(false)
              this.loaderService.hide()
              this.registerForm().reset()
              this.clearAvatar()
              this.clearHeader()

              this.router.navigate(['/'])
              this.userService.loadUserData(true)
              this.alertService.show('Подтвердите ваш аккаунт через почту.', '', false)
            })
        }, error: (error) => {
          this.loaderService.hide()
          this.isRegistrationRequestNow.set(false)
          this.alertService.show('Ошибка при регстрации', error.status, true)
        }
      })
    }
  }
}
