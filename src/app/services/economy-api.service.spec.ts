import { TestBed } from '@angular/core/testing';

import { EconomyApiService } from './economy-api.service';

describe('EconomyApiService', () => {
  let service: EconomyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EconomyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
