import { AlertService } from './../alert/alert.service';
import { inject, Injectable, signal } from '@angular/core';
import { VideoPreview } from '../../interfaces/video/preview';
import { ProfilePreview } from '../../interfaces/profile/preview';
import { Video } from '../../interfaces/video/video';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { Commentry } from '../../interfaces/commentary/commentary';
import { HttpClient } from '@angular/common/http';
import { masterURL } from '../masterURL';
import { ConverterObjToFormdataService } from '../converter/converter-obj-to-formdata.service';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
    private converterObjToFD = inject(ConverterObjToFormdataService)
    private http = inject(HttpClient)
    private mainURL = masterURL
    private alert = inject(AlertService)

    // TEMPORARY CODE WITH TEMPLATES !!!!!
    author: ProfilePreview = {
        avatar: './templates/template_avatar.jpg',
        username: 'Timur khen',
        subscribers: 13
    } 
    private videosTemplate = signal<VideoPreview[]>([
        {
            id: '1',
            title: 'Как приготовить идеальный кофе за 5 минут',
            preview: './templates/previews/teamplate_preview_2.jpg',
            author: this.author,
            views: 1542000,
            uploadDate: new Date('2026-03-15')
        },
        {
            id: '2',
            title: 'Обзор нового iPhone 17 Pro Max',
            preview: './templates/previews/teamplate_preview.jpg',
            author: this.author,
            views: 3420000,
            uploadDate: new Date('2026-03-10')
        },
        {
            id: '3',
            title: '10 ошибок начинающих программистов',
            preview: './templates/previews/teamplate_preview_3.jpg',
            author: this.author,
            views: 567000,
            uploadDate: new Date('2026-03-05')
        },
        {
            id: '4',
            title: '10 ошибок начинающих программистов',
            preview: './templates/previews/teamplate_preview.jpg',
            author: this.author,
            views: 567000,
            uploadDate: new Date('2026-03-05')
        },
        {
            id: '5',
            title: '10 ошибок начинающих программистов',
            preview: './templates/previews/teamplate_preview.jpg',
            author: this.author,
            views: 567000,
            uploadDate: new Date('2026-03-05')
        },
        {
            id: '6',
            title: '10 ошибок начинающих программистов',
            preview: './templates/previews/teamplate_preview_2.jpg',
            author: this.author,
            views: 567000,
            uploadDate: new Date('2026-03-05')
        },
    ])

    get videos() {
        return signal<VideoPreview[]>(this.videosTemplate())
    }

    getVideoByID(id: string): Observable<Video> {
        const commentArray: Commentry[] = [
        {
            author: this.author,
            content: 'Помню ваши первые видео, выросли качественно!',
            publishDate: new Date('2024-06-15')
        },
        {
            author: this.author,
            content: 'Случайно нашел канал, очень нравится!',
            publishDate: new Date('2025-11-20')
        },
        {
            author: this.author,
            content: 'Лучший канал по этой теме!',
            publishDate: new Date('2026-01-01')
        },
        {
            author: this.author,
            content: 'Круто!!!!!',
            publishDate: new Date('2026-01-02')
        },
        {
            author: this.author,
            content: 'Самый мрачный Никита - это легенда!',
            publishDate: new Date('2026-01-03')
        },
        {
            author: this.author,
            content: 'Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита',
            publishDate: new Date('2026-01-03')
        },
        {
            author: this.author,
            content: '<script>alert("hello")</script>',
            publishDate: new Date('2026-01-10')
        },
        {
            author: this.author,
            content: 'Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита',
            publishDate: new Date('2026-01-03')
        },
        {
            author: this.author,
            content: '<script>alert("hello")</script>',
            publishDate: new Date('2026-01-10')
        },
        {
            author: this.author,
            content: 'Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита',
            publishDate: new Date('2026-01-03')
        },
        {
            author: this.author,
            content: '<script>alert("hello")</script>',
            publishDate: new Date('2026-01-10')
        },
        {
            author: this.author,
            content: 'Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита Самый мрачный Никита',
            publishDate: new Date('2026-01-03')
        },
        {
            author: this.author,
            content: '<script>alert("hello")</script>',
            publishDate: new Date('2026-01-10')
        }
    ]
    
        let videoURL = ''

        if (id === '1') {
            videoURL = './templates/videos/teamplate_video.mp4'
        } else {
            videoURL = `./templates/videos/teamplate_video_${id}.mp4`
        }

        return of({
            id: id,
            title: 'Testovoe',
            description : 'qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty ',
            preview: './templates/previews/teamplate_preview.jpg',
            video: videoURL,
            author: this.author,
            views: 123123123,
            uploadDate: new Date('2026-01-01'),
            comments: commentArray,
            likes: 30,
            dislikes: 2
        })
    }

    createVideo(videoForm: {
        video: File | null | undefined,
        name: string,
        description: string,
        preview: File | null | undefined
    }) {
        const formData = this.converterObjToFD.objectToFormData(videoForm);
        
        return this.http.post(this.mainURL, formData)
        .pipe(
            catchError((err) => {
                this.alert.show(
                    'Ошибка при создании видео',
                    `Номер ошибки ${err.status}`,
                    true
                )
                return throwError(err)
            })
        )
    }

    searchVideos(keyword: string) {
        return this.http.get(
            this.mainURL + '/search/' + keyword
        ).pipe(
            catchError((err) => {
                this.alert.show(
                    'Ошибка поиска',
                    `Номер ошибки ${err.status}`,
                    true
                )
                return throwError(err)
            })   
        )
    }
}
