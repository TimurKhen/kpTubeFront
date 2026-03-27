import { Injectable } from '@angular/core';
import { VideoPreview } from '../../interfaces/video/preview';
import { ProfilePreview } from '../../interfaces/profile/preview';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  author: ProfilePreview = {
    avatar: './templates/template_avatar.jpg',
    username: 'Timur khen'
  } 
  videos: VideoPreview[] = [
    {
        id: '1',
        title: 'Как приготовить идеальный кофе за 5 минут',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 1542000,
        uploadDate: new Date('2026-03-15')
    },
    {
        id: '2',
        title: 'Обзор нового iPhone 17 Pro Max',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 3420000,
        uploadDate: new Date('2026-03-10')
    },
    {
        id: '3',
        title: '10 ошибок начинающих программистов',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 567000,
        uploadDate: new Date('2026-03-05')
    },
    {
        id: '4',
        title: 'Путешествие на Бали: лучшие места',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 8900000,
        uploadDate: new Date('2026-02-28')
    },
    {
        id: '5',
        title: 'Как выучить английский за 3 месяца',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 2345000,
        uploadDate: new Date('2026-02-20')
    },
    {
        id: '6',
        title: 'Топ 5 игр 2026 года',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 1234000,
        uploadDate: new Date('2026-02-15')
    },
    {
        id: '7',
        title: 'Секреты успешного YouTube канала',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 876000,
        uploadDate: new Date('2026-02-10')
    },
    {
        id: '8',
        title: 'Как заработать на фрилансе новичку',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 654000,
        uploadDate: new Date('2026-02-05')
    },
    {
        id: '9',
        title: 'Обзор Tesla Model 3 2026',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 4320000,
        uploadDate: new Date('2026-01-28')
    },
    {
        id: '10',
        title: 'Как сделать сайт на React за час',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 987000,
        uploadDate: new Date('2026-01-25')
    },
    {
        id: '11',
        title: 'Лучшие фильмы 2025 года',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 3210000,
        uploadDate: new Date('2026-01-20')
    },
    {
        id: '12',
        title: 'Как похудеть без диет: мифы и реальность',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 765000,
        uploadDate: new Date('2026-01-15')
    },
    {
        id: '13',
        title: 'Обзор новинок косметики 2026',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 543000,
        uploadDate: new Date('2026-01-10')
    },
    {
        id: '14',
        title: 'Как создать стартап с нуля',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 2100000,
        uploadDate: new Date('2026-01-05')
    },
    {
        id: '15',
        title: 'Советы по фотографии для начинающих',
        preview: './templates/teamplate_preview.jpg',
        author: this.author,
        views: 432000,
        uploadDate: new Date('2026-01-01')
    }
];
}
