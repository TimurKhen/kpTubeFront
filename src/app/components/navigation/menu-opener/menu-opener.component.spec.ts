import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOpenerComponent } from './menu-opener.component';

describe('MenuOpenerComponent', () => {
  let component: MenuOpenerComponent;
  let fixture: ComponentFixture<MenuOpenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuOpenerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
