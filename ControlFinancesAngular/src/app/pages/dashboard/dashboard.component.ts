import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../services/finance.service';
import { AuthService } from '../../services/auth.service';
import { User, DashboardSummary, Goal, Budget } from '../../models/data-models';
import { ChartComponent } from '../../components/chart/chart.component';
import { ChartType } from 'chart.js';
import { Observable, forkJoin, map } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  get nomeUsuario(): string {
    return this.currentUser?.nome?.split(' ')[0] || 'Usuário';
  }
  currentMonth: string = '';
  summary$!: Observable<DashboardSummary>;
  goals$!: Observable<Goal[]>;
  budgets$!: Observable<Budget[]>;
  
  // Dados para Gráficos
  revenueExpenseChartData$!: Observable<{ labels: string[], data: number[] }>;
  expenseDistributionChartData$!: Observable<{ labels: string[], data: number[] }>;
  
  // Configurações dos Gráficos
  barChartType: ChartType = 'bar';
  doughnutChartType: ChartType = 'doughnut';
  
  barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => this.formatCurrency(value)
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) { label += this.formatCurrency(context.parsed.y); }
            return label;
          }
        }
      }
    }
  };

  doughnutChartOptions = {
    plugins: {
      legend: { position: 'right' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const valor = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentual = ((valor / total) * 100).toFixed(1);
            return `${label}: ${this.formatCurrency(valor)} (${percentual}%)`;
          }
        }
      }
    }
  };

  constructor(private authService: AuthService, private financeService: FinanceService) {
    this.currentMonth = this.getCurrentYearMonth();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.summary$ = this.financeService.getDashboardSummary(this.currentMonth);
    this.goals$ = this.financeService.getGoalsInProgress();
    this.budgets$ = this.financeService.getBudgetsByMonth(this.currentMonth);
    
    this.revenueExpenseChartData$ = this.financeService.getRevenueExpenseData(this.currentMonth);
    this.expenseDistributionChartData$ = this.financeService.getExpenseDistribution(this.currentMonth).pipe(
      map(data => {
        // Filtra categorias com valor zero para não aparecerem no gráfico
        const filteredLabels: string[] = [];
        const filteredData: number[] = [];
        data.data.forEach((value, index) => {
          if (value > 0) {
            filteredLabels.push(this.getNomeCategoria(data.labels[index]));
            filteredData.push(value);
          }
        });
        return { labels: filteredLabels, data: filteredData };
      })
    );
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getCurrentYearMonth(): string {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  }

  getNomeCategoria(categoria: string): string {
    const categorias: { [key: string]: string } = {
      'moradia': 'Moradia',
      'alimentacao': 'Alimentação',
      'transporte': 'Transporte',
      'saude': 'Saúde',
      'educacao': 'Educação',
      'lazer': 'Lazer',
      'impostos': 'Impostos',
      'investimentos': 'Investimentos',
      'outros': 'Outros',
      'salario': 'Salário',
      'extra': 'Extra'
    };
    return categorias[categoria] || categoria;
  }

  getIconeCategoria(categoria: string): string {
    const icones: { [key: string]: string } = {
        'moradia': '🏠',
        'alimentacao': '🍽️',
        'transporte': '🚗',
        'saude': '🏥',
        'educacao': '📚',
        'lazer': '🎮',
        'impostos': '📋',
        'investimentos': '💎',
        'outros': '📦'
    };
    return icones[categoria] || '📦';
  }

  getBudgetStatus(budget: Budget): { percentual: number, status: string } {
    const percentual = budget.limite > 0 ? (budget.gasto / budget.limite) * 100 : 0;
    const status = percentual >= 100 ? 'danger' : 
                   percentual >= budget.alerta ? 'warning' : 'success';
    return { percentual: Math.min(percentual, 100), status };
  }
}
