import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Goal, Budget } from '../../models/data-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-planejamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planejamento.component.html',
  styleUrls: ['./planejamento.component.css']
})
export class PlanejamentoComponent implements OnInit {
  goals$!: Observable<Goal[]>;
  budgets$!: Observable<Budget[]>;
  
  // Formulário de Meta
  novaMeta: Partial<Goal> = {
    nome: '',
    valor: 0,
    dataAlvo: new Date()
  };

  // Formulário de Orçamento
  novoOrcamento: Partial<Budget> = {
    mes: this.getCurrentYearMonth(),
    categoria: 'alimentacao',
    limite: 0,
    alerta: 80
  };

  categoriasDespesa = [
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'moradia', label: 'Moradia' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'impostos', label: 'Impostos' },
    { value: 'investimentos', label: 'Investimentos' },
    { value: 'outros', label: 'Outros' }
  ];

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.goals$ = this.financeService.getGoals();
    this.budgets$ = this.financeService.getBudgets();
  }

  // --- Metas CRUD ---

  adicionarMeta(): void {
    if (this.novaMeta.valor! <= 0 || !this.novaMeta.nome || !this.novaMeta.dataAlvo) {
      alert('Preencha todos os campos obrigatórios com valores válidos.');
      return;
    }

    this.financeService.addGoal(this.novaMeta as Omit<Goal, 'id' | 'valorAtual' | 'concluida'>).subscribe(
      () => {
        this.resetMetaForm();
        alert('Meta adicionada com sucesso!');
      },
      error => alert('Erro ao adicionar meta.')
    );
  }

  excluirMeta(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.financeService.deleteGoal(id).subscribe(
        () => alert('Meta excluída com sucesso!'),
        error => alert('Erro ao excluir meta.')
      );
    }
  }

  resetMetaForm(): void {
    this.novaMeta = {
      nome: '',
      valor: 0,
      dataAlvo: new Date()
    };
  }

  // --- Orçamentos CRUD ---

  adicionarOrcamento(): void {
    if (this.novoOrcamento.limite! <= 0 || !this.novoOrcamento.mes || !this.novoOrcamento.categoria) {
      alert('Preencha todos os campos obrigatórios com valores válidos.');
      return;
    }

    this.financeService.addBudget(this.novoOrcamento as Omit<Budget, 'id' | 'gasto'>).subscribe(
      () => {
        this.resetOrcamentoForm();
        alert('Orçamento adicionado com sucesso!');
      },
      error => alert('Erro ao adicionar orçamento.')
    );
  }

  excluirOrcamento(id: string): void {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      this.financeService.deleteBudget(id).subscribe(
        () => alert('Orçamento excluído com sucesso!'),
        error => alert('Erro ao excluir orçamento.')
      );
    }
  }

  resetOrcamentoForm(): void {
    this.novoOrcamento = {
      mes: this.getCurrentYearMonth(),
      categoria: 'alimentacao',
      limite: 0,
      alerta: 80
    };
  }

  // --- Utilitários ---

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
    const cat = this.categoriasDespesa.find(c => c.value === categoria);
    return cat ? cat.label : categoria;
  }

  getBudgetStatus(budget: Budget): { percentual: number, status: string } {
    const percentual = budget.limite > 0 ? (budget.gasto / budget.limite) * 100 : 0;
    const status = percentual >= 100 ? 'danger' : 
                   percentual >= budget.alerta ? 'warning' : 'success';
    return { percentual: Math.min(percentual, 100), status };
  }
}
