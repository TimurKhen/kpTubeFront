import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumbersFormaterService {

  constructor() { }

  private formatter = Intl.NumberFormat('en', {
    notation: 'compact'
  })

  setSimpleNumberValue(num: number): string {
    return this.formatter.format(num)
  }
}
