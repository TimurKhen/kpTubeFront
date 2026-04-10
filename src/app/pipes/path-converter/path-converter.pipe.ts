import { Pipe, PipeTransform } from '@angular/core';
import { masterURL } from '../../services/masterURL';

@Pipe({
  name: 'pathConverter',
})
export class PathConverterPipe implements PipeTransform {
  urlFrom = 'http://127.0.0.1:8000/'

  transform(link: string | undefined): string {
    if (!link) return ''
    
    if (link.startsWith(this.urlFrom)) {
      link = link.replace(this.urlFrom, masterURL + '/files/')
    }
    return link
  }

}
