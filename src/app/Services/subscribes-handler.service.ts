import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SubscribesHandlerService {
  subscribe = 'https://kptube.kringeproduction.ru/subscribe/'

  http = inject(HttpClient)

  constructor() {
  }

  subscribeToBlogger(User_ID: string, Blogger_ID: string) {
    const formData = new FormData()

    formData.append('User_ID', String(User_ID))
    formData.append('Blogger_ID', String(Blogger_ID))

    let headers = new HttpHeaders()

    const username = String(localStorage.getItem('username'))
    const password = String(localStorage.getItem('password'))

    headers = headers.set('X-USERNAME', username)
    headers = headers.set('X-PASSWORD', password)

    return this.http.post(this.subscribe, formData, {headers: headers})
  }

  unSubscribeFromBlogger(User_ID: string, Blogger_ID: string) {
    const formData = new FormData()
    formData.append('User_ID', String(User_ID))
    formData.append('Blogger_ID', String(Blogger_ID))

    const username = String(localStorage.getItem('username'))
    const password = String(localStorage.getItem('password'))

    let headers = new HttpHeaders()
    headers = headers.set('X-USERNAME', username)
    headers = headers.set('X-PASSWORD', password)

    return this.http.put(this.subscribe, formData, {headers: headers})
  }

  subscriber(isSubscribe: boolean, blogger: string) {
    let userId = String(localStorage.getItem('UserID'))

    if (!isSubscribe) {
      return this.subscribeToBlogger(userId, blogger)
    } else {
      return this.unSubscribeFromBlogger(userId, blogger)
    }
  }
}
