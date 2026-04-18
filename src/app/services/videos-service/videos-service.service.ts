import { UserService } from './../user-service/user-service.service';
import { inject, Injectable } from '@angular/core';
import { VideoInterface } from '../../interfaces/video/video';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { masterURL } from '../masterURL';
import { ConverterObjToFormdataService } from '../converter/converter-obj-to-formdata.service';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
    private converterObjToFD = inject(ConverterObjToFormdataService)
    private http = inject(HttpClient)
    private userService = inject(UserService)
    private allVideos = masterURL + '/videos/'
    private watchVideo = masterURL + '/watch_video/'

    getVideos(): Observable<VideoInterface[]> {
        return this.http.get<VideoInterface[]>(this.allVideos)
    }

    getVideoByID(id: string): Observable<VideoInterface[]> {
        return this.http.get<VideoInterface[]>(this.allVideos + '?Video_ID=' + id)
    }

    getVideosByUser(userName: string): Observable<VideoInterface[]> {
        return this.http.get<VideoInterface[]>(this.allVideos + '?owner=' + userName)
    }

    createVideo(videoForm: {
      Video_ID: string,
      video: File | null | undefined,
      name: string,
      description: string,
      preview: File | null | undefined,
      owner: string,
      category: "По умолчанию",
      isGlobal: boolean
    }) {
      const formData = this.converterObjToFD.objectToFormData(videoForm);

      return this.http.post(this.allVideos, formData)
    }

    saveView(videoId: string) {
      this.userService.loadUserData()
      const token = this.userService.token()

      if (!token) {
        return throwError('Cant saveView')
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })

      const current_date = new Date()

      const post_data = {
        'User_ID': this.userService.userData()?.User_ID,
        'Video_ID': videoId,
        'length': 0,
        'date': current_date.getDate(),
        'time': current_date.getTime(),
        'time_zone': current_date.getTimezoneOffset()
      }

      return this.http.post(this.watchVideo, post_data, {headers: headers})
    }

    // searchVideos(keyword: string) {
    //     return this.http.get(
    //         this.mainURL + '/search/' + keyword
    //     ).pipe(
    //         catchError((err) => {
    //             this.alert.show(
    //                 'Ошибка поиска',
    //                 `Номер ошибки ${err.status}`,
    //                 true
    //             )
    //             return throwError(err)
    //         })
    //     )
    // }
}
