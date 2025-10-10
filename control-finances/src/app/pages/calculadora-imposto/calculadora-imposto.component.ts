import { Component } from '@angular/core';

export interface ResultadoCalculo {
  impostoDevido: number;
  aliquotaEfetiva: number;
}

@Component({
  selector: 'app-calculadora-imposto',
  templateUrl: './impostos.component.html',
  styleUrls: ['./impostos.component.css']
  // REMOVER: imports: [CommonModule, FormsModule, DecimalPipe]
})
export class CalculadoraImpostoComponent {
  rendaAnual: number = 0;
  tipoImpostoSelecionado: string = 'irpf';
  resultadoCalculo: ResultadoCalculo | null = null;

  calcularImposto(): void {
    if (this.rendaAnual <= 0) return;

    let impostoDevido = 0;
    
    if (this.tipoImpostoSelecionado === 'irpf') {
      impostoDevido = this.calcularIRPF();
    } else if (this.tipoImpostoSelecionado === 'simples') {
      impostoDevido = this.calcularSimples();
    }

    const aliquotaEfetiva = (impostoDevido / this.rendaAnual) * 100;
    
    this.resultadoCalculo = {
      impostoDevido,
      aliquotaEfetiva
    };
  }

  private calcularIRPF(): number {
    const renda = this.rendaAnual;
    let imposto = 0;

    if (renda <= 22847.76) {
      imposto = 0;
    } else if (renda <= 33919.80) {
      imposto = (renda * 0.075) - 1713.58;
    } else if (renda <= 45012.60) {
      imposto = (renda * 0.15) - 4257.57;
    } else if (renda <= 55976.16) {
      imposto = (renda * 0.225) - 7633.51;
    } else {
      imposto = (renda * 0.275) - 10432.32;
    }

    return Math.max(0, imposto);
  }

  private calcularSimples(): number {
    return this.rendaAnual * 0.06;
  }

  calcularImpostosPF(): void {
    this.calcularImposto();
  }
}