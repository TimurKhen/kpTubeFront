import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber',
})
export class ShortNumberPipe implements PipeTransform {

  transform(value: number | undefined): string {
    if (value === undefined) return ''
    
    return new Intl.NumberFormat('ru', {
      notation: 'compact'
    }).format(value)
  }

}
