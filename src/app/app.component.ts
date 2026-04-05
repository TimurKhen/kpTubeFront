import {Component, ViewContainerRef} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { AlertService } from './services/alert/alert.service';
import { SideBarComponent } from "./components/side-bar/side-bar.component";
import { LoaderService } from './services/loader/loader.service';
import { AcceptService } from './services/accept/accept.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  constructor(
    private alertService: AlertService, 
    private loaderService: LoaderService,
    private acceptService: AcceptService,
    private vcr: ViewContainerRef 
  ) {
    this.alertService.setContainer(this.vcr)
    this.loaderService.setContainer(this.vcr)
    this.acceptService.setContainer(this.vcr)
  }
}
