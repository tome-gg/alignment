import { TestBed } from '@angular/core/testing';

import { PhantomService } from './phantom.service';

describe('PhantomService', () => {
  let service: PhantomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhantomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
