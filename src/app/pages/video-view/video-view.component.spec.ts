import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoViewComponent } from './video-view.component';

describe('VideoViewComponent', () => {
  let component: VideoViewComponent;
  let fixture: ComponentFixture<VideoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
