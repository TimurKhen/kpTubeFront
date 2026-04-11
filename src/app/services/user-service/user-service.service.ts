import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { masterURL } from '../masterURL';
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router';

interface tokensResponse {
  acces_token: string, 
  refresh_token: string
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private cookieService = inject(CookieService)

  private account = masterURL + '/users/'
  private createUser = masterURL + '/create_user/'
  private userCache = new Map<string, Observable<ProfileInterface[]>>()

  public userName = signal<string>('')
  public userData = signal<ProfileInterface | null>(null)
  token = signal<string | null>(null)
  refreshToken = signal<string | null>(null)

  get isAuth() {
    if (!this.token()) {
      this.loadUserData()
    }
    return !!this.token()
  }

  loadUserData() {
    this.token.set(this.cookieService.get('token'))
    this.refreshToken.set(this.cookieService.get('refreshToken'))

    if (!this.token()) {
      // !!!!!!!!!!!!!!!!!!!!!!!!!
      // !     ВХОД В АККАУНТ    !
      // !!!!!!!!!!!!!!!!!!!!!!!!!
      // this.getUserByName(this.userName()).subscribe((data) => {
      //   if (data.length !== 1) return
      //   this.userData.set(data[0])
      // })
    }
  }

  refreshAuthToken() {
    return this.http.post<tokensResponse>(
      masterURL + '/refresh',
      JSON.stringify({
        'refresh_token': this.refreshToken
      })
    ).pipe(
      tap(val => this.saveTokens(val)),
      catchError(err => {
        this.logout()
        return throwError(err)
      })
    )
  }

  logout() {
    this.userName.set('')
    this.cookieService.deleteAll()
    this.token.set(null)
    this.refreshToken.set(null)
    this.userData.set(null)

    this.router.navigate(['/reg'])
  }

  saveTokens(tokens: tokensResponse) {
    this.token.set(tokens.acces_token)
    this.refreshToken.set(tokens.refresh_token)

    if (!this.token() || !this.refreshToken()) this.logout()

    this.cookieService.set('token', String(this.token()))
    this.cookieService.set('refreshToken', String(this.refreshToken()))
  }

  getUserByID(UserID: string) {
    return this.http.get<any>(this.account + '?User_ID=' + UserID)
  }

  register(formData: FormData) {
    return this.http.post(this.createUser, formData)
  }

  enterUser(name: string, password: string) {
    return this.http.get<tokensResponse>(
      this.account + '?name=' + name, 
    ).pipe(
      tap((val: tokensResponse) => this.saveTokens(val))
    )
  }

  getUserByName(name: string): Observable<ProfileInterface[]> {
    if (this.userCache.has(name)) {
      return this.userCache.get(name)!
    }

    const request$ = this.http.get<ProfileInterface[]>(
      this.account + '?name=' + name
    ).pipe(
      shareReplay(1)
    )

    this.userCache.set(name, request$)
    return request$
  }

  clearCache(): void {
    this.userCache.clear()
  }
}