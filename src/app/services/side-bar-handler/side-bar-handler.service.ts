import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideBarHandlerService {
  public isSideBarOpen = signal<boolean>(false)
}
