import { TestBed } from '@angular/core/testing';

import { AdsServiceService } from './ads-service.service';

describe('AdsServiceService', () => {
  let service: AdsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
