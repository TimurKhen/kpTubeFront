import { UserService } from './../user-service/user-service.service';
import { inject, Injectable } from '@angular/core';
import { VideoInterface } from '../../interfaces/video/video';
import { Observable } from 'rxjs';
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
        file: File | null | undefined,
        name: string,
        description: string,
        preview: File | null | undefined,
        owner: string,
        category: "По умолчанию",
        isGlobal: boolean
    }) {
        this.userService.loadUserData()

        const formData = this.converterObjToFD.objectToFormData(videoForm)
        return this.http.post(this.allVideos, formData)
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
