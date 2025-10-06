import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleFinancasComponent } from './controle-financas.component';

describe('ControleFinancasComponent', () => {
  let component: ControleFinancasComponent;
  let fixture: ComponentFixture<ControleFinancasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleFinancasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleFinancasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
