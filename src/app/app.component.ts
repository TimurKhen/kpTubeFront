import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { AlertService } from './services/alert/alert.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  constructor(
    private alertService: AlertService, 
    private vcr: ViewContainerRef 
  ) {
    this.alertService.setContainer(this.vcr)
  }

  ngOnInit(): void {
    this.alertService.show(
      'Test',
      'kruto',
      true
    )
  }
}
