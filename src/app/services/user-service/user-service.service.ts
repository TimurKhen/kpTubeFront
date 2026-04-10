import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, shareReplay, throwError } from 'rxjs';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { masterURL } from '../masterURL';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient)
  private account = masterURL + '/users/'
  private createUser = masterURL + '/create_user/'
  private userCache = new Map<string, Observable<ProfileInterface[]>>()

  public userName = signal<string>('')
  public userData = signal<ProfileInterface | null>(null)
  public password = signal<string>('') 

  get isAuth() {
    if (this.userName().length === 0 || this.password().length === 0) {
      this.loadUserData()
    }
    return this.userName.length > 0 && this.password.length > 0
  }

  loadUserData() {
    this.userName.set(localStorage.getItem('username') || '')
    this.password.set(localStorage.getItem('password') || '')

    if (this.userName() === '' || this.password() === '') return

    if (this.userData() === null) {
      this.getUserByName(this.userName()).subscribe((data) => {
        if (data.length !== 1) return
        this.userData.set(data[0])
      })
    }
  }

  logout() {
    this.userName.set('')
    this.password.set('')
    this.userData.set(null)
  }

  setUsernameAndPassword(username: string, password: string) {
    this.userName.set(username)
    this.password.set(password)

    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }

  getUserByID(UserID: string) {
    let headers = new HttpHeaders()
  
    headers = headers.set('X-USERNAME', String(this.userName()))
    headers = headers.set('X-PASSWORD', String(this.password()))

    return this.http.get<any>(this.account + '?User_ID=' + UserID, {headers: headers})
  }

  register(formData: FormData) {
    return this.http.post(this.createUser, formData)
  }

  enterUser(name: string, password: string) {
    this.setUsernameAndPassword(name, password)

    let headers = new HttpHeaders()
  
    headers = headers.set('X-USERNAME', String(this.userName()))
    headers = headers.set('X-PASSWORD', String(this.password()))

    return this.http.get<ProfileInterface[]>(
      this.account + '?name=' + name, 
      {headers: headers}
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