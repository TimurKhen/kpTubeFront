import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConverter',
})
export class TimeConverterPipe implements PipeTransform {

  transform(value: number): string{
    let minutes = value / 60
    let seconds = value % 60
    let hours = 0 

    if (minutes > 60) {
      hours = minutes / 60
      minutes = minutes % 60
    }

    if (hours === 0) {
      return `${minutes}:${seconds}`
    } else {
      return `${hours}:${minutes}:${seconds}`
    }
  }

}
