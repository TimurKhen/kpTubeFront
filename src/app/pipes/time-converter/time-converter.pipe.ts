import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConverter',
})
export class TimeConverterPipe implements PipeTransform {

  transform(value: number): string{
    let minutes = Math.round(value / 60)
    let seconds = value % 60
    let hours = 0 

    if (minutes > 60) {
      hours = Math.round(minutes / 60)
      minutes = minutes % 60
    }

    if (hours === 0) {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    } else {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  }

}
