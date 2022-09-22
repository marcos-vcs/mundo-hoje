import { TestBed } from '@angular/core/testing';

import { LocalDbServiceService } from './local-db-service.service';

describe('LocalDbServiceService', () => {
  let service: LocalDbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
