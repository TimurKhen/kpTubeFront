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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
