import { TestBed } from '@angular/core/testing';

import { MapDataApiService } from './map-data-api.service';

describe('MapDataApiService', () => {
  let service: MapDataApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapDataApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
