import { Component, inject, signal } from '@angular/core';
import { ProfilePreview } from '../../interfaces/profile/preview';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuOpenerComponent } from "./menu-opener/menu-opener.component";
import { NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";
import { SideBarHandlerService } from '../../services/side-bar-handler/side-bar-handler.service';

@Component({
  selector: 'navigation',
  imports: [MenuOpenerComponent, ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  userInformation = signal<ProfilePreview>({
    avatar: './templates/template_avatar.jpg',
    username: 'TimurKhen',
    subscribers: 123
  })
  searchForm = new FormControl('', [Validators.required, Validators.minLength(1)])
  sideBarService = inject(SideBarHandlerService)

  changeStatusOfOpen($event: boolean) {
    this.sideBarService.isSideBarOpen.set($event)
  }
}
