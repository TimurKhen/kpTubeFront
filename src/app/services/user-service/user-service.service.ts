import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProfileInterface } from '../../interfaces/profile/profile-interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getUserByID(id: string): Observable<ProfileInterface> {
    return of({
      avatar: './templates/template_avatar.jpg',
      header: './templates/previews/teamplate_preview_2.jpg',
      username: 'Timur Khen',
      subscribers: 100000,
      videos: ['2', '3', '3', '2', '3', '2']
    })
  }
}
