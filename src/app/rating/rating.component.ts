import {Component} from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent {
  star_value = 0
  stars_array = [1, 2, 3, 4, 5]

  set_number(id: number) {
    this.star_value = id
  }
}
