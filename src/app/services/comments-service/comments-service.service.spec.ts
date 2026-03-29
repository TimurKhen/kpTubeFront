import { TestBed } from '@angular/core/testing';

import { CommentsServiceService } from './comments-service.service';

describe('CommentsServiceService', () => {
  let service: CommentsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
