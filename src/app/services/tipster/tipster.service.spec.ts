import { TestBed } from '@angular/core/testing';

import { TipsterService } from './tipster.service';

describe('TipsterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipsterService = TestBed.get(TipsterService);
    expect(service).toBeTruthy();
  });
});
