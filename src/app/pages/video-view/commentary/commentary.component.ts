import { Component, computed, input, OnInit, signal } from '@angular/core';
import { Commentry } from '../../../interfaces/commentary/commentary';
import { TimeAgoPipe } from '../../../pipes/time-ago/time-ago-pipe.pipe';

@Component({
  selector: 'commentary',
  imports: [TimeAgoPipe],
  templateUrl: './commentary.component.html',
  styleUrl: './commentary.component.scss',
})
export class CommentaryComponent implements OnInit {
  content = input.required<Commentry>() 
  // По факту тут должен передаваться ID
  maxCommentLength = 120
  shortedComment = computed(() => {
    const comment = this.content().content

    if (comment.length > this.maxCommentLength) {
      return comment.slice(0, this.maxCommentLength) + '...' 
    } else {
      return comment
    }
  })
  isLongComment = computed(() => this.content().content.length > this.maxCommentLength)
  isCommentOpen = signal<boolean>(false)

  changeCommentOpenStatus() {
    this.isCommentOpen.update((val: boolean) => !val)
  }

  ngOnInit() {
    // console.log(this.content())
  }
}
