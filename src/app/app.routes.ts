import {Routes} from '@angular/router'
import { VideosGridComponent } from './pages/videos-grid/videos-grid.component'
import { VideoViewComponent } from './pages/video-view/video-view.component'
import { VideoCreateComponent } from './pages/video-create/video-create.component'

export const routes: Routes = [
  {
    path: '', component: VideosGridComponent
  },
  {
    path: 'video/:id', component: VideoViewComponent,
  }, {
    path: 'create', component: VideoCreateComponent
  }
]
