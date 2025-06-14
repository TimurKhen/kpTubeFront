import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { videos } from "../videos-part/videos-part.component"
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf, NgOptimizedImage, NgStyle} from "@angular/common";
import {filter, forkJoin} from "rxjs";
import {VideosFetchService} from "../../Services/videos-fetch.service";
import {VideoInterface} from "../../Interfaces/video-interface";
import {LinkChangerService} from "../../Services/link-changer.service";
import {NumbersFormaterService} from "../../Services/numbers-formater.service";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgStyle,
    NgClass,
    NgForOf,
  ],
  styleUrls: ['./search-results.component.sass']
})
export class SearchResultsComponent implements OnInit {
  VideoFetchService = inject(VideosFetchService)
  LinkChangerService = inject(LinkChangerService)
  NumbersFormaterService = inject(NumbersFormaterService)

  results: any[] = []

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let search = params.get('userSearch') || ''
      this.searchResults(search)
    })
  }

  NumberFormater(num: any): string {
    return this.NumbersFormaterService.setSimpleNumberValue(num)
  }

  searchResults(search: string) {
    this.VideoFetchService.searchVideos(search).subscribe((videos: VideoInterface[]) => {
      videos.map((video) => {
        video = this.LinkChangerService.videoLinksChanger(video)
      })
      this.results = videos
    })
  }
}
