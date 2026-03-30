import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCreateComponent } from './video-create.component';

describe('VideoCreateComponent', () => {
  let component: VideoCreateComponent;
  let fixture: ComponentFixture<VideoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
