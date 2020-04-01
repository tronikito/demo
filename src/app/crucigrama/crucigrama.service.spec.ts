import { TestBed } from '@angular/core/testing';

import { CrucigramaService } from './crucigrama.service';

describe('CrucigramaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrucigramaService = TestBed.get(CrucigramaService);
    expect(service).toBeTruthy();
  });
});
