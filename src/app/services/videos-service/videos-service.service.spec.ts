import { TestBed } from '@angular/core/testing';

import { VideosServiceService } from './videos-service.service';

describe('VideosServiceService', () => {
  let service: VideosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
