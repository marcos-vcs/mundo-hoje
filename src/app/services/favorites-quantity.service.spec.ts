import { TestBed } from '@angular/core/testing';

import { FavoritesQuantityService } from './favorites-quantity.service';

describe('FavoritesQuantityService', () => {
  let service: FavoritesQuantityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesQuantityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
