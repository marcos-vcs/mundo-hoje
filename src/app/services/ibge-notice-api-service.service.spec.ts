import { TestBed } from '@angular/core/testing';

import { IbgeNoticeApiServiceService } from './ibge-notice-api-service.service';

describe('IbgeNoticeApiServiceService', () => {
  let service: IbgeNoticeApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbgeNoticeApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
