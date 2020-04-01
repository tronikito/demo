import { TestBed } from '@angular/core/testing';

import { StylesService } from './styles.service';

describe('StylesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StylesService = TestBed.get(StylesService);
    expect(service).toBeTruthy();
  });
});
