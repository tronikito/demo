import { TestBed } from '@angular/core/testing';

import { SopaService } from './sopa.service';

describe('SopaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SopaService = TestBed.get(SopaService);
    expect(service).toBeTruthy();
  });
});
