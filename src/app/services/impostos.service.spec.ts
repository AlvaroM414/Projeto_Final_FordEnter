import { TestBed } from '@angular/core/testing';

import { ImpostosService } from './impostos.service';

describe('ImpostosService', () => {
  let service: ImpostosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpostosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
