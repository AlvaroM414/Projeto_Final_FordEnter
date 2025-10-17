import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction, Goal, Budget, DashboardSummary } from '../models/data-models';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  // --- Dados Iniciais (Mock Data) ---
  private getCurrentYearMonth(): string {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  }

  private currentYearMonth = this.getCurrentYearMonth();

  /**
   * Dados iniciais mockados para Transações.
   * Em uma aplicação real, estes dados seriam obtidos de uma API.
   */
  private initialTransactions: Transaction[] = [
    // Outubro (Mês Atual)
    { id: 't1', tipo: 'receita', valor: 5500.00, descricao: 'Salário - Outubro', data: new Date('2025-10-05'), categoria: 'salario' },
    { id: 't2', tipo: 'despesa', valor: 1200.00, descricao: 'Aluguel', data: new Date('2025-10-01'), categoria: 'moradia' },
    { id: 't3', tipo: 'despesa', valor: 450.00, descricao: 'Supermercado 1', data: new Date('2025-10-03'), categoria: 'alimentacao' },
    { id: 't4', tipo: 'despesa', valor: 150.00, descricao: 'Conta de Luz', data: new Date('2025-10-08'), categoria: 'moradia' },
    { id: 't5', tipo: 'receita', valor: 800.00, descricao: 'Freelance Design', data: new Date('2025-10-10'), categoria: 'extra' },
    { id: 't6', tipo: 'despesa', valor: 120.00, descricao: 'Gasolina', data: new Date('2025-10-12'), categoria: 'transporte' },
    { id: 't7', tipo: 'despesa', valor: 250.00, descricao: 'Plano de Saúde', data: new Date('2025-10-15'), categoria: 'saude' },
    { id: 't8', tipo: 'despesa', valor: 180.00, descricao: 'Jantar Restaurante', data: new Date('2025-10-15'), categoria: 'alimentacao' },
    { id: 't9', tipo: 'despesa', valor: 90.00, descricao: 'Internet e TV', data: new Date('2025-10-18'), categoria: 'moradia' },
    { id: 't10', tipo: 'despesa', valor: 450.00, descricao: 'Mensalidade Faculdade', data: new Date('2025-10-20'), categoria: 'educacao' },
    { id: 't11', tipo: 'despesa', valor: 150.00, descricao: 'Cinema e Pipoca', data: new Date('2025-10-22'), categoria: 'lazer' },
    { id: 't12', tipo: 'despesa', valor: 100.00, descricao: 'Presente Aniversário', data: new Date('2025-10-25'), categoria: 'outros' },
    { id: 't13', tipo: 'despesa', valor: 200.00, descricao: 'Investimento CDB', data: new Date('2025-10-28'), categoria: 'investimentos' },
    { id: 't14', tipo: 'despesa', valor: 100.00, descricao: 'Supermercado 2', data: new Date('2025-10-30'), categoria: 'alimentacao' },
    { id: 't20', tipo: 'receita', valor: 300.00, descricao: 'Venda Online', data: new Date('2025-10-29'), categoria: 'extra' },
    { id: 't21', tipo: 'despesa', valor: 70.00, descricao: 'Café com Amigos', data: new Date('2025-10-27'), categoria: 'lazer' },
    { id: 't22', tipo: 'despesa', valor: 50.00, descricao: 'Aplicativo de Transporte', data: new Date('2025-10-26'), categoria: 'transporte' },
    { id: 't23', tipo: 'despesa', valor: 300.00, descricao: 'Parcela de Empréstimo', data: new Date('2025-10-25'), categoria: 'investimentos' },
    { id: 't24', tipo: 'despesa', valor: 200.00, descricao: 'Curso Online', data: new Date('2025-10-24'), categoria: 'educacao' },
    
    // Setembro (Mês Anterior)
    { id: 't15', tipo: 'receita', valor: 5500.00, descricao: 'Salário - Setembro', data: new Date('2025-09-05'), categoria: 'salario' },
    { id: 't16', tipo: 'despesa', valor: 1200.00, descricao: 'Aluguel', data: new Date('2025-09-01'), categoria: 'moradia' },
    { id: 't17', tipo: 'despesa', valor: 500.00, descricao: 'Supermercado', data: new Date('2025-09-04'), categoria: 'alimentacao' },
    { id: 't18', tipo: 'despesa', valor: 100.00, descricao: 'Conta de Água', data: new Date('2025-09-10'), categoria: 'moradia' },
    { id: 't19', tipo: 'despesa', valor: 300.00, descricao: 'Passeio Final de Semana', data: new Date('2025-09-15'), categoria: 'lazer' },
  ];
  
  /**
   * Dados iniciais mockados para Metas.
   * Em uma aplicação real, estes dados seriam obtidos de uma API.
   */
  private initialGoals: Goal[] = [
    { id: 'g1', nome: 'Reserva de Emergência', valor: 10000.00, valorAtual: 3500.00, dataAlvo: new Date('2026-06-01'), concluida: false },
    { id: 'g2', nome: 'Viagem para a Praia', valor: 3000.00, valorAtual: 1500.00, dataAlvo: new Date('2025-12-20'), concluida: false },
    { id: 'g3', nome: 'Troca de Carro', valor: 25000.00, valorAtual: 500.00, dataAlvo: new Date('2027-01-01'), concluida: false },
  ];

  /**
   * Dados iniciais mockados para Orçamentos.
   * Em uma aplicação real, estes dados seriam obtidos de uma API.
   * O campo 'gasto' é calculado dinamicamente com base nas transações mockadas.
   */
  private initialBudgets: Budget[] = [
    { id: 'b1', mes: this.currentYearMonth, categoria: 'alimentacao', limite: 800.00, gasto: 0, alerta: 80 },
    { id: 'b2', mes: this.currentYearMonth, categoria: 'lazer', limite: 300.00, gasto: 0, alerta: 70 },
    { id: 'b3', mes: this.currentYearMonth, categoria: 'transporte', limite: 200.00, gasto: 0, alerta: 90 },
    { id: 'b4', mes: '2025-09', categoria: 'alimentacao', limite: 750.00, gasto: 0, alerta: 80 },
  ];

  // Helper para calcular o gasto de uma categoria em um dado mês
  private calculateCategoryExpense(yearMonth: string, category: string): number {
    return this.initialTransactions
      .filter(t => t.tipo === 'despesa' && t.categoria === category && t.data.toISOString().substring(0, 7) === yearMonth)
      .reduce((sum, t) => sum + t.valor, 0);
  }

  constructor() {
    // Inicializa os gastos dos orçamentos com base nas transações mockadas
    this.initialBudgets = this.initialBudgets.map(budget => ({
      ...budget,
      gasto: this.calculateCategoryExpense(budget.mes, budget.categoria)
    }));

    // Atualiza os BehaviorSubjects com os dados iniciais processados
    this.transactionsSubject.next(this.initialTransactions);
    this.goalsSubject.next(this.initialGoals);
    this.budgetsSubject.next(this.initialBudgets);
  }


  // --- Subjects para o estado reativo ---
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  goals$ = this.goalsSubject.asObservable();

  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  budgets$ = this.budgetsSubject.asObservable();



  // --- Funções de Transações (CRUD) ---

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  getTransactionsByMonth(yearMonth: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => transactions.filter(t => {
        const dateString = t.data.toISOString().substring(0, 7);
        return dateString === yearMonth;
      }))
    );
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      data: new Date(transaction.data)
    };
    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next([...currentTransactions, newTransaction]);
    return of(newTransaction);
  }

  updateTransaction(updatedTransaction: Transaction): Observable<Transaction> {
    const currentTransactions = this.transactionsSubject.value;
    const index = currentTransactions.findIndex(t => t.id === updatedTransaction.id);
    if (index > -1) {
      const newTransactions = [...currentTransactions];
      newTransactions[index] = { ...updatedTransaction, data: new Date(updatedTransaction.data) };
      this.transactionsSubject.next(newTransactions);
      return of(newTransactions[index]);
    }
    return of(updatedTransaction);
  }

  deleteTransaction(id: string): Observable<boolean> {
    const currentTransactions = this.transactionsSubject.value;
    const newTransactions = currentTransactions.filter(t => t.id !== id);
    this.transactionsSubject.next(newTransactions);
    return of(true);
  }

  // --- Funções de Metas (CRUD) ---

  getGoals(): Observable<Goal[]> {
    return this.goals$;
  }

  getGoalsInProgress(): Observable<Goal[]> {
    return this.goals$.pipe(
      map(goals => goals.filter(g => !g.concluida).slice(0, 3))
    );
  }

  addGoal(goal: Omit<Goal, 'id' | 'valorAtual' | 'concluida'>): Observable<Goal> {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      valorAtual: 0,
      concluida: false,
      dataAlvo: new Date(goal.dataAlvo)
    };
    const currentGoals = this.goalsSubject.value;
    this.goalsSubject.next([...currentGoals, newGoal]);
    return of(newGoal);
  }

  updateGoal(updatedGoal: Goal): Observable<Goal> {
    const currentGoals = this.goalsSubject.value;
    const index = currentGoals.findIndex(g => g.id === updatedGoal.id);
    if (index > -1) {
      const newGoals = [...currentGoals];
      newGoals[index] = { ...updatedGoal, dataAlvo: new Date(updatedGoal.dataAlvo) };
      this.goalsSubject.next(newGoals);
      return of(newGoals[index]);
    }
    return of(updatedGoal);
  }

  deleteGoal(id: string): Observable<boolean> {
    const currentGoals = this.goalsSubject.value;
    const newGoals = currentGoals.filter(g => g.id !== id);
    this.goalsSubject.next(newGoals);
    return of(true);
  }
  
  // --- Funções de Orçamentos (CRUD) ---

  getBudgets(): Observable<Budget[]> {
    return this.budgets$;
  }

  getBudgetsByMonth(yearMonth: string): Observable<Budget[]> {
    return this.budgets$.pipe(
      map(budgets => budgets.filter(b => b.mes === yearMonth))
    );
  }

  addBudget(budget: Omit<Budget, 'id' | 'gasto'>): Observable<Budget> {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      gasto: this.calculateCategoryExpense(budget.mes, budget.categoria) // Calcula o gasto inicial para o novo orçamento
    };
    const currentBudgets = this.budgetsSubject.value;
    this.budgetsSubject.next([...currentBudgets, newBudget]);
    return of(newBudget);
  }

  updateBudget(updatedBudget: Budget): Observable<Budget> {
    const currentBudgets = this.budgetsSubject.value;
    const index = currentBudgets.findIndex(b => b.id === updatedBudget.id);
    if (index > -1) {
      const newBudgets = [...currentBudgets];
      newBudgets[index] = { ...updatedBudget, gasto: this.calculateCategoryExpense(updatedBudget.mes, updatedBudget.categoria) };
      this.budgetsSubject.next(newBudgets);
      return of(newBudgets[index]);
    }
    return of(updatedBudget);
  }

  deleteBudget(id: string): Observable<boolean> {
    const currentBudgets = this.budgetsSubject.value;
    const newBudgets = currentBudgets.filter(b => b.id !== id);
    this.budgetsSubject.next(newBudgets);
    return of(true);
  }

  // --- Funções de Dashboard ---

  getDashboardSummary(yearMonth: string): Observable<DashboardSummary> {
    return this.getTransactionsByMonth(yearMonth).pipe(
      map(transactions => {
        const receitas = transactions
          .filter(t => t.tipo === 'receita')
          .reduce((sum, t) => sum + t.valor, 0);
        
        const despesas = transactions
          .filter(t => t.tipo === 'despesa')
          .reduce((sum, t) => sum + t.valor, 0);

        return {
          totalReceitas: receitas,
          totalDespesas: despesas,
          saldo: receitas - despesas,
          transacoesMes: transactions.length
        } as DashboardSummary;
      })
    );
  }

  getExpenseDistribution(yearMonth: string): Observable<{ labels: string[], data: number[] }> {
    return this.getTransactionsByMonth(yearMonth).pipe(
      map(transactions => {
        const despesasMes = transactions.filter(t => t.tipo === 'despesa');
        
        const despesasPorCategoria = despesasMes.reduce((acc, t) => {
          const categoria = t.categoria || 'outros';
          acc[categoria] = (acc[categoria] || 0) + t.valor;
          return acc;
        }, {} as { [key: string]: number });

        const labels = Object.keys(despesasPorCategoria);
        const data = Object.values(despesasPorCategoria);

        return { labels, data };
      })
    );
  }
  
  getRevenueExpenseData(yearMonth: string): Observable<{ labels: string[], data: number[] }> {
    return this.getTransactionsByMonth(yearMonth).pipe(
      map(transactions => {
        const receitas = transactions
          .filter(t => t.tipo === 'receita')
          .reduce((sum, t) => sum + t.valor, 0);
        
        const despesas = transactions
          .filter(t => t.tipo === 'despesa')
          .reduce((sum, t) => sum + t.valor, 0);

        return {
          labels: ['Receitas', 'Despesas'],
          data: [receitas, despesas]
        };
      })
    );
  }
}
