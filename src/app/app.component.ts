import {Component, ViewContainerRef} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { AlertService } from './services/alert/alert.service';
import { SideBarComponent } from "./components/side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  constructor(
    private alertService: AlertService, 
    private vcr: ViewContainerRef 
  ) {
    this.alertService.setContainer(this.vcr)
  }
}
