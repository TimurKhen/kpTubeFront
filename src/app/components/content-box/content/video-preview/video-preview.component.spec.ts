import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { VideoPreviewComponent } from './video-preview.component';

describe('VideoPreviewComponent', () => {
  let component: VideoPreviewComponent;
  let fixture: ComponentFixture<VideoPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPreviewComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPreviewComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('content', {
      id: 1,
      name: 'test',
      owner: 'test',
      preview: 'test',
      Video_ID: 'test',
      views: 0,
      creation_date: 'test',
      accessType: 1
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
