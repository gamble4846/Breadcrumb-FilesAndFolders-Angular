import { TestBed } from '@angular/core/testing';

import { GoogleAppScritsService } from './google-app-scrits.service';

describe('GoogleAppScritsService', () => {
  let service: GoogleAppScritsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAppScritsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
