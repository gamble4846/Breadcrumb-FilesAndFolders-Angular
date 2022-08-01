import { TestBed } from '@angular/core/testing';

import { LocalBaseService } from './local-base.service';

describe('LocalBaseService', () => {
  let service: LocalBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
