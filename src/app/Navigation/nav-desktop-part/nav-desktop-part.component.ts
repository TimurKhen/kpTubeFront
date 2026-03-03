import {Component, OnInit} from '@angular/core';
import { NgClass } from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SystemIconsStylesDirective} from "../../Directives/system-icons-styles.directive";

@Component({
    selector: 'app-desktop-nav-part',
    imports: [
    NgClass,
    RouterLink,
    FormsModule,
    SystemIconsStylesDirective
],
    templateUrl: './nav-desktop-part.component.html',
    styleUrl: './nav-desktop-part.component.sass',
})
export class NavDesktopPartComponent {
  isOpen = false


  constructor(private router: Router) {
  }

  toggleMenu() {
    this.isOpen = !this.isOpen
  }

  set_client_web_pos() {
    this.router.navigate(['/'])
  }
}
