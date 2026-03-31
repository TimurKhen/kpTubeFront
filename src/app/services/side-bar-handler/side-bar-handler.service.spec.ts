import { TestBed } from '@angular/core/testing';

import { SideBarHandlerService } from './side-bar-handler.service';

describe('SideBarHandlerService', () => {
  let service: SideBarHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideBarHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
