import {Router} from '@angular/router';
import {Component, inject, OnInit, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../services/user-service/user-service.service';
import {AlertService} from '../../services/alert/alert.service';
import {catchError, throwError} from 'rxjs';
import {form, FormField, required} from "@angular/forms/signals";

interface Login {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoading = signal<boolean>(false)
  private userService = inject(UserService)
  private router = inject(Router)
  private alertService = inject(AlertService)
  private loginData = signal<Login>({
    username: '', password: ''
  })

  loginForm = form(this.loginData, (schema) => {
    required(schema.username)
    required(schema.password)
  })

  ngOnInit() {
    this.userService.logout(false)
  }

  enter($event: Event) {
    $event.preventDefault()
    this.isLoading.set(true)

    const formValues = this.loginData()

    if (formValues) {
      this.userService.enterUser(formValues.username!, formValues.password!)
        .pipe(catchError((err) => {
          this.isLoading.set(false)
          this.alertService.show('Ошибка при входе в аккаунт', 'Проверьте данные для входа', true)

          return throwError(err)
        }))
        .subscribe((data) => {
          this.isLoading.set(false)
          this.alertService.show('Вы успешно вошли в аккаунт', '', false)
          this.userService.loadUserData(true)
          this.router.navigate(['/'])
        })
    }
  }
}
