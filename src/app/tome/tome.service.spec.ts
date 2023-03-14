import { TestBed } from '@angular/core/testing';

import { TomeService } from './tome.service';

describe('TomeService', () => {
  let service: TomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
