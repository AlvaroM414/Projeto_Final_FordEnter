import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleFinanceiroComponent } from './controle-financeiro.component';

describe('ControleFinanceiroComponent', () => {
  let component: ControleFinanceiroComponent;
  let fixture: ComponentFixture<ControleFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleFinanceiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
