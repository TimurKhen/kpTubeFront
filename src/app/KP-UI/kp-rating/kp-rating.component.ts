import {ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {VideosFetchService} from "../../Services/videos-fetch.service"
import {SystemIconsStylesDirective} from "../../Directives/system-icons-styles.directive";

@Component({
  selector: 'app-kp-rating',
  standalone: true,
  imports: [
    NgForOf,
    SystemIconsStylesDirective
  ],
  templateUrl: './kp-rating.component.html',
  styleUrl: './kp-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpRatingComponent implements OnChanges {
  VideosFetchService = inject(VideosFetchService)

  stars = [1, 2, 3, 4, 5]
  @Input() current_star: number = 0
  @Input() video_id: string = ''

  ngOnChanges(changes: SimpleChanges) {
    this.current_star = Number(changes["current_star"]["currentValue"])
  }

  change_current_star(item: number) {
    this.current_star = item
    this.post_stars_data()
  }

  post_stars_data() {
    let userId = String(localStorage.getItem('UserID'))
    this.VideosFetchService.postStars(userId, this.video_id, this.current_star).subscribe(
      d => {
        console.log(d)
      }
    )
  }
}
