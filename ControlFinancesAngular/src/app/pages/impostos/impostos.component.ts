import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-impostos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './impostos.component.html',
  styleUrls: ['./impostos.component.css']
})
export class ImpostosComponent {
  tipoPessoa: 'PF' | 'PJ' = 'PF';
  rendaBruta: number | null = null;
  deducoes: number | null = null;
  aliquotaIRPJ: number = 0.15; // Exemplo de alíquota IRPJ
  aliquotaCSLL: number = 0.09; // Exemplo de alíquota CSLL

  impostoCalculado: number | null = null;
  detalhesCalculo: string[] = [];

  calcularImposto(): void {
    this.impostoCalculado = null;
    this.detalhesCalculo = [];

    if (this.tipoPessoa === 'PF') {
      this.calcularImpostoPF();
    } else {
      this.calcularImpostoPJ();
    }
  }

  calcularImpostoPF(): void {
    if (this.rendaBruta === null || this.rendaBruta < 0) {
      this.detalhesCalculo.push('Por favor, insira uma renda bruta válida.');
      return;
    }

    const baseCalculo = Math.max(0, this.rendaBruta - (this.deducoes || 0));
    this.detalhesCalculo.push(`Renda Bruta: ${this.formatCurrency(this.rendaBruta)}`);
    this.detalhesCalculo.push(`Deduções: ${this.formatCurrency(this.deducoes || 0)}`);
    this.detalhesCalculo.push(`Base de Cálculo (PF): ${this.formatCurrency(baseCalculo)}`);

    // Tabela progressiva do IRRF (simplificada para exemplo)
    let imposto = 0;
    if (baseCalculo <= 2112.00) {
      imposto = 0;
      this.detalhesCalculo.push('Faixa 1: Isento');
    } else if (baseCalculo <= 2826.65) {
      imposto = baseCalculo * 0.075 - 158.40;
      this.detalhesCalculo.push('Faixa 2: 7.5% - Parcela a deduzir R$ 158,40');
    } else if (baseCalculo <= 3751.05) {
      imposto = baseCalculo * 0.15 - 370.40;
      this.detalhesCalculo.push('Faixa 3: 15% - Parcela a deduzir R$ 370,40');
    } else if (baseCalculo <= 4664.68) {
      imposto = baseCalculo * 0.225 - 651.73;
      this.detalhesCalculo.push('Faixa 4: 22.5% - Parcela a deduzir R$ 651,73');
    } else {
      imposto = baseCalculo * 0.275 - 884.96;
      this.detalhesCalculo.push('Faixa 5: 27.5% - Parcela a deduzir R$ 884,96');
    }

    this.impostoCalculado = Math.max(0, imposto);
    this.detalhesCalculo.push(`Imposto de Renda Pessoa Física (IRPF): ${this.formatCurrency(this.impostoCalculado)}`);
  }

  calcularImpostoPJ(): void {
    if (this.rendaBruta === null || this.rendaBruta < 0) {
      this.detalhesCalculo.push('Por favor, insira uma renda bruta válida.');
      return;
    }

    this.detalhesCalculo.push(`Renda Bruta: ${this.formatCurrency(this.rendaBruta)}`);

    // Cálculo simplificado para PJ (Lucro Presumido/Real para IRPJ e CSLL)
    // Considera que a renda bruta é a base de cálculo para simplificar
    const irpj = this.rendaBruta * this.aliquotaIRPJ;
    const csll = this.rendaBruta * this.aliquotaCSLL;
    const totalImposto = irpj + csll;

    this.detalhesCalculo.push(`Alíquota IRPJ: ${this.aliquotaIRPJ * 100}%`);
    this.detalhesCalculo.push(`IRPJ: ${this.formatCurrency(irpj)}`);
    this.detalhesCalculo.push(`Alíquota CSLL: ${this.aliquotaCSLL * 100}%`);
    this.detalhesCalculo.push(`CSLL: ${this.formatCurrency(csll)}`);

    this.impostoCalculado = totalImposto;
    this.detalhesCalculo.push(`Imposto Total Pessoa Jurídica (IRPJ + CSLL): ${this.formatCurrency(this.impostoCalculado)}`);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}

