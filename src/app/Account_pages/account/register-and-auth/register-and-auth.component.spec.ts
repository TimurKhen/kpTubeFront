import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAndAuthComponent } from './register-and-auth.component';

describe('RegisterAndAuthComponent', () => {
  let component: RegisterAndAuthComponent;
  let fixture: ComponentFixture<RegisterAndAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAndAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAndAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
