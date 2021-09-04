import { TestBed } from '@angular/core/testing';

import { CallsService } from './calls.service';

describe('CallsService', () => {
  let service: CallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
