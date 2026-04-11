import { TestBed } from '@angular/core/testing';

import { OnlineHandlerService } from './online-handler.service';

describe('OnlineHandlerService', () => {
  let service: OnlineHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
