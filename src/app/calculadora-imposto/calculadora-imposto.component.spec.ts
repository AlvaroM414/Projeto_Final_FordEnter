import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraImpostoComponent } from './calculadora-imposto.component';

describe('CalculadoraImpostoComponent', () => {
  let component: CalculadoraImpostoComponent;
  let fixture: ComponentFixture<CalculadoraImpostoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculadoraImpostoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadoraImpostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
