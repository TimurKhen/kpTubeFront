import { Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user-service.service';
import { AlertService } from '../../services/alert/alert.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private userService = inject(UserService)
  private router = inject(Router)
  private alertService = inject(AlertService)

  isLoading = signal<boolean>(false)

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  enter($event: Event) {
    $event.preventDefault()
    this.isLoading.set(true)

    const formValues = this.loginForm.value

    if (formValues) {
      this.userService.enterUser(formValues.username!, formValues.password!)
        .pipe(
          catchError((err) => {
            this.isLoading.set(false)
            this.alertService.show(
              'Ошибка при входе в аккаунт',
              'Проверьте данные для входа',
              true
            )

            return throwError(err)
          })
        )  
        .subscribe((data) => {
          this.isLoading.set(false)
          this.alertService.show(
            'Вы успешно вошли в аккаунт',
            '',
            false
          )
          this.userService.loadUserData()
          this.router.navigate(['/'])
        })
    }
  }
}
