import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraImpostosComponent } from './calculadora-impostos.component';

describe('CalculadoraImpostosComponent', () => {
  let component: CalculadoraImpostosComponent;
  let fixture: ComponentFixture<CalculadoraImpostosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculadoraImpostosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadoraImpostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
