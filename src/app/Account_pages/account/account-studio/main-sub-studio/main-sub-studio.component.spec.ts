import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSubStudioComponent } from './main-sub-studio.component';

describe('MainSubStudioComponent', () => {
  let component: MainSubStudioComponent;
  let fixture: ComponentFixture<MainSubStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSubStudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSubStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
