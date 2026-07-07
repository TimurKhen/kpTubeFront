import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentaryComponent } from './commentary.component';

describe('CommentaryComponent', () => {
  let component: CommentaryComponent;
  let fixture: ComponentFixture<CommentaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentaryComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('content', {
      id: 1,
      video: 'test',
      author: 'test',
      content: 'test content',
      creation_date: '123'
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
