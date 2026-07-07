import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ContentBoxComponent } from './content-box.component';

describe('ContentBoxComponent', () => {
  let component: ContentBoxComponent;
  let fixture: ComponentFixture<ContentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentBoxComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentBoxComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('contentType', 1);
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
