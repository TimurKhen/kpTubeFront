import { TestBed } from '@angular/core/testing';

import { NumbersFormaterService } from './numbers-formater.service';

describe('NumbersFormaterService', () => {
  let service: NumbersFormaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumbersFormaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
