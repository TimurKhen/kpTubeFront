import { TestBed } from '@angular/core/testing';

import { SubscribesHandlerService } from './subscribes-handler.service';

describe('SubscribesHandlerService', () => {
  let service: SubscribesHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribesHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
