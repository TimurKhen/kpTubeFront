import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MenuOpenerComponent } from "../navigation/menu-opener/menu-opener.component";
import { SideBarHandlerService } from '../../services/side-bar-handler/side-bar-handler.service';

@Component({
  selector: 'app-side-bar',
  imports: [NgClass, RouterLink, MenuOpenerComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  sideBarService = inject(SideBarHandlerService)
  isOpen = this.sideBarService.isSideBarOpen
  buttons = [
    {
      icon: './icons/home-icon.svg',
      title: 'Главная',
      router: '/',
    },
    // {
    //   icon: './icons/playlist-icon.svg',
    //   title: 'Плейлисты',
    //   router: '/playlists',
    // },
    {
      icon: './icons/plus-icon.svg',
      title: 'Создать',
      router: '/create',
    }
  ]

  changeStatusOfOpen($event: boolean) {
    this.sideBarService.isSideBarOpen.set($event)
  }
}
