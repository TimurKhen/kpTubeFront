import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {trigger, transition, style, animate} from '@angular/animations';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SystemIconsStylesDirective} from "../../Directives/system-icons-styles.directive";

@Component({
  selector: 'app-desktop-nav-part',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    FormsModule,
    SystemIconsStylesDirective,
  ],
  templateUrl: './nav-desktop-part.component.html',
  styleUrl: './nav-desktop-part.component.sass',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('0.2s', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.7s', style({opacity: 0}))
      ])
    ])
  ]
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
