import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleFinancas } from './controle-financas';

describe('ControleFinancas', () => {
  let component: ControleFinancas;
  let fixture: ComponentFixture<ControleFinancas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleFinancas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleFinancas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
