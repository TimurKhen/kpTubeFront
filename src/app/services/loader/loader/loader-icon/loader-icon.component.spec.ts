import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderIconComponent } from './loader-icon.component';

describe('LoaderIconComponent', () => {
  let component: LoaderIconComponent;
  let fixture: ComponentFixture<LoaderIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
