import { TestBed } from '@angular/core/testing';

import { IbgeNoticeApiService } from './ibge-notice-api.service';

describe('IbgeNoticeApiService', () => {
  let service: IbgeNoticeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbgeNoticeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
