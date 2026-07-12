import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideBarHandlerService {
  isSideBarOpen = signal<boolean>(false)
}
