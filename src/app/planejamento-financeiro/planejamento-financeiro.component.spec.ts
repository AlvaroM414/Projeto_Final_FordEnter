import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoFinanceiroComponent } from './planejamento-financeiro.component';

describe('PlanejamentoFinanceiroComponent', () => {
  let component: PlanejamentoFinanceiroComponent;
  let fixture: ComponentFixture<PlanejamentoFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanejamentoFinanceiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanejamentoFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
