import { Component, Input, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #chartCanvas></canvas>',
  styles: ['']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartType!: ChartType;
  @Input() chartData!: { labels: string[], data: number[] };
  @Input() chartOptions: any = {};

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | undefined;

  constructor() { }

  ngOnInit(): void {
    // Inicializa o gráfico no ngOnInit se os dados estiverem disponíveis
    if (this.chartData) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recria ou atualiza o gráfico quando os dados de entrada mudam
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const dataConfig = {
      labels: this.chartData.labels,
      datasets: [{
        data: this.chartData.data,
        // Configurações padrão para cores, que podem ser sobrescritas por chartOptions
        backgroundColor: this.getDefaultColors(this.chartType, this.chartData.data.length),
        borderColor: this.getDefaultBorders(this.chartType, this.chartData.data.length),
        borderWidth: 1,
        ...this.chartOptions.datasets // Permite sobrescrever configurações do dataset
      }]
    };

    const config: ChartConfiguration = {
      type: this.chartType,
      data: dataConfig,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...this.chartOptions
      }
    };

    this.chartInstance = new Chart(this.chartCanvas.nativeElement, config);
  }

  private updateChart(): void {
    if (this.chartInstance && this.chartData) {
      this.chartInstance.data.labels = this.chartData.labels;
      this.chartInstance.data.datasets[0].data = this.chartData.data;
      this.chartInstance.data.datasets[0].backgroundColor = this.getDefaultColors(this.chartType, this.chartData.data.length);
      this.chartInstance.data.datasets[0].borderColor = this.getDefaultBorders(this.chartType, this.chartData.data.length);
      this.chartInstance.update();
    } else if (this.chartData) {
      this.createChart();
    }
  }

  private getDefaultColors(type: ChartType, count: number): string[] {
    if (type === 'bar') {
      // Cores específicas para Receitas e Despesas
      return ['rgba(56, 239, 125, 0.8)', 'rgba(244, 92, 67, 0.8)'];
    }
    // Cores dinâmicas para gráficos de rosca/pizza
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * (360 / count)}, 70%, 50%)`);
    }
    return colors;
  }

  private getDefaultBorders(type: ChartType, count: number): string[] {
    if (type === 'bar') {
      // Cores de borda específicas para Receitas e Despesas
      return ['rgba(56, 239, 125, 1)', 'rgba(244, 92, 67, 1)'];
    }
    // Cores de borda dinâmicas para gráficos de rosca/pizza
    const borders = [];
    for (let i = 0; i < count; i++) {
      borders.push(`hsl(${i * (360 / count)}, 70%, 40%)`);
    }
    return borders;
  }
}
