import { TestBed } from '@angular/core/testing';

import { Planejamento } from './planejamento';

describe('Planejamento', () => {
  let service: Planejamento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Planejamento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
