import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StrShorterService {

  constructor() { }

  shorterString(str: string, maxLength: number) {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength) + "...";
  }
}
