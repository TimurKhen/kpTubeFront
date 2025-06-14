import {RouterModule, Routes} from '@angular/router'
import { VideosPartComponent } from './Videos_pages/videos-part/videos-part.component'
import { SearchResultsComponent } from './Videos_pages/search-results/search-results.component'

export const routes: Routes = [
  {
    path: '', component: VideosPartComponent
  },
  {
    path: 'account',
    loadComponent: () => import('./Account_pages/account/account.component').then(m => m.AccountComponent)
  }, {
    path: 'creating',
    loadComponent: () => import('./Videos_pages/video-creating/video-creating.component').then(m => m.VideoCreatingComponent)
  },
  {
    path: 'video/:Video_ID',
    loadComponent: () => import('./Videos_pages/video/video.component').then(m => m.VideoComponent)
  },
  {
    path: 'account/:User_ID',
    loadComponent: () => import('./Account_pages/other-account/other-account.component').then(m => m.OtherAccountComponent)
  },
  {
    path: 'KPmusic',
    loadComponent: () => import('./Music_pages/music-part/music-part.component').then(m => m.MusicPartComponent)
  },
  {
    path: 'KPmusic/Creating',
    loadComponent: () => import('./Music_pages/music-creating/music-creating.component').then(m => m.MusicCreatingComponent)
  },
  {
    path: 'search/:userSearch',
    component: SearchResultsComponent
  },
  {
    path: 'history',
    loadComponent: () => import('./Videos_pages/history/history.component').then(m => m.HistoryComponent)
  },
  {
    path: 'liked',
    loadComponent: () => import('./Videos_pages/liked-videos/liked-videos.component').then(m => m.LikedVideosComponent)
  },
]
