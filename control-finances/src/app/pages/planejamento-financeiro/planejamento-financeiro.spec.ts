import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoFinanceiro } from './planejamento-financeiro.component';

describe('PlanejamentoFinanceiro', () => {
  let component: PlanejamentoFinanceiro;
  let fixture: ComponentFixture<PlanejamentoFinanceiro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanejamentoFinanceiro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanejamentoFinanceiro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
