import { Component, input } from '@angular/core';
import { Commentry } from '../../../interfaces/commentary/commentary';
import { TimeAgoPipe } from '../../../pipes/time-ago/time-ago-pipe.pipe';

@Component({
  selector: 'commentary',
  imports: [TimeAgoPipe],
  templateUrl: './commentary.component.html',
  styleUrl: './commentary.component.scss',
})
export class CommentaryComponent {
  content = input.required<Commentry>()
}
