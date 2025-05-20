import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticSubStudioComponent } from './statistic-sub-studio.component';

describe('StatisticSubStudioComponent', () => {
  let component: StatisticSubStudioComponent;
  let fixture: ComponentFixture<StatisticSubStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticSubStudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticSubStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
