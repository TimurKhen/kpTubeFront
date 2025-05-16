import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStudioComponent } from './account-studio.component';

describe('AccountStudioComponent', () => {
  let component: AccountStudioComponent;
  let fixture: ComponentFixture<AccountStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountStudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
