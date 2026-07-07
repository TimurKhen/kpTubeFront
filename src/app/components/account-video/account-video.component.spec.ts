import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVideoComponent } from './account-video.component';

describe('AccountVideoComponent', () => {
  let component: AccountVideoComponent;
  let fixture: ComponentFixture<AccountVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountVideoComponent);
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
