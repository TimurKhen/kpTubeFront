import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { masterURL } from '../masterURL';
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router';

interface tokensResponse {
  access_token: string,
  refresh_token: string | undefined | null
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private cookieService = inject(CookieService)

  private account = masterURL + '/users/'
  private tokenUrl = masterURL + '/token/'
  private createUser = masterURL + '/create_user/'
  private sendMail = masterURL + '/send_mail/'
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

    const currentUser = localStorage.getItem('username') || ''
    if (currentUser !== '') {
      this.getUserByName(currentUser).subscribe(user => {
        this.userData.set(user[0])
      })
    }
  }

  refreshAuthToken() {
    return this.http.post<tokensResponse>(
      this.tokenUrl + 'refresh/',
      JSON.stringify({
        'refresh_token': this.refreshToken()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    ).pipe(
      tap(val => this.saveTokens(val)),
      catchError(err => {
        this.logout()
        return throwError(err)
      })
    )
  }

  logout(changePath: boolean=true) {
    this.userName.set('')
    this.token.set(null)
    this.refreshToken.set(null)
    this.cookieService.deleteAll()
    this.userData.set(null)
    this.clearCache()

    localStorage.removeItem('username')

    if (changePath) {
      this.router.navigate(['/registration'])
    }
  }

  saveTokens(tokens: tokensResponse) {
    if (tokens.access_token) {
      this.token.set(tokens.access_token)
      this.cookieService.set('token', String(this.token()))
    }

    if (tokens.refresh_token) {
      this.refreshToken.set(tokens.refresh_token)
      this.cookieService.set('refreshToken', String(this.refreshToken()))
    }
  }

  getUserByID(UserID: string) {
    return this.http.get<any>(this.account + '?User_ID=' + UserID)
  }

  register(formData: FormData) {
    return this.http.post<tokensResponse>(this.createUser, formData)
      .pipe(
        tap((val: tokensResponse) => this.saveTokens(val))
      )
  }

  enterUser(name: string, password: string) {
    localStorage.setItem('username', name)

    return this.http.post<tokensResponse>(
      this.tokenUrl,
      JSON.stringify({
        "username": name,
        "password": password
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      tap((val: tokensResponse) => this.saveTokens(val))
    )
  }

  getUserByName(name: string): Observable<ProfileInterface[]> {
    if (this.userCache.has(name)) {
      return this.userCache.get(name)!
    }

    const request$ = this.http.get<ProfileInterface[]>(
      this.account + '?username=' + name
    ).pipe(
      shareReplay(1)
    )

    this.userCache.set(name, request$)
    return request$
  }

  clearCache(): void {
    this.userCache.clear()
  }

  send_email(mail: string): Observable<any> {
    return this.http.get((this.sendMail + '?email=' + mail))
  }
}
