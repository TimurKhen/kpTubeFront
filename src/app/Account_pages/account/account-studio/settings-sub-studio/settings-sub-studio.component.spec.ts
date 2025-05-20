import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSubStudioComponent } from './settings-sub-studio.component';

describe('SettingsSubStudioComponent', () => {
  let component: SettingsSubStudioComponent;
  let fixture: ComponentFixture<SettingsSubStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsSubStudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsSubStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
