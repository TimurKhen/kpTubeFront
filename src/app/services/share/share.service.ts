import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  async share() {
    const shareUrl = window.location.href

    await navigator.clipboard.writeText(shareUrl)
  }
}
