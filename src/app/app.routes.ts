import {Routes} from '@angular/router'
import { VideosGridComponent } from './pages/videos-grid/videos-grid.component'
import { VideoViewComponent } from './pages/video-view/video-view.component'
import { VideoCreateComponent } from './pages/video-create/video-create.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { RegistrationComponent } from './pages/registration/registration.component'
import { AccountComponent } from './pages/account/account.component'
import { accountGuard } from './services/guards/account-guard.guard'
import { LoginComponent } from './pages/login/login.component'

export const routes: Routes = [
  {
    path: '', component: VideosGridComponent
  },
  {
    path: 'video/:id', component: VideoViewComponent,
  }, 
  {
    path: 'create', component: VideoCreateComponent
  },
  {
    path: 'profile/:id', component: ProfileComponent
  },
  {
    path: 'registration', component: RegistrationComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'account', component: AccountComponent, canActivate: [accountGuard]
  }
]
