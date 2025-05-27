import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinkChangerService {
  urlFrom = 'http://127.0.0.1:8000/'
  urlTo = 'https://kptube.kringeproduction.ru/files/'

  constructor() {
  }

  videoLinksChanger(video: any) {
    if (video.video && video.video.startsWith(this.urlFrom)) {
      video.video = video.video.replace(this.urlFrom, this.urlTo);
    }
    if (video.preview && video.preview.startsWith(this.urlFrom)) {
      video.preview = video.preview.replace(this.urlFrom, this.urlTo);
    }
    return video
  }

  accountLinksChanger(account: any) {
    if (account.header.startsWith(this.urlFrom)) {
      account.header = account.header.replace(this.urlFrom, this.urlTo)
    }

    if (account.avatar.startsWith(this.urlFrom)) {
      account.avatar = account.avatar.replace(this.urlFrom, this.urlTo)
    }

    return account
  }


  linkChanger(link: any) {
    if (link.startsWith(this.urlFrom)) {
      link = link.replace(this.urlFrom, this.urlTo);
    }
    return link
  }
}
