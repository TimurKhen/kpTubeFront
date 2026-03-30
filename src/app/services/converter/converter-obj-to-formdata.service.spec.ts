import { TestBed } from '@angular/core/testing';

import { ConverterObjToFormdataService } from './converter-obj-to-formdata.service';

describe('ConverterObjToFormdataService', () => {
  let service: ConverterObjToFormdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConverterObjToFormdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
