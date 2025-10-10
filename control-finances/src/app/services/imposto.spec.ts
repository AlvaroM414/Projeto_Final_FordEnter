import { TestBed } from '@angular/core/testing';

import { Imposto } from './imposto';

describe('Imposto', () => {
  let service: Imposto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Imposto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
