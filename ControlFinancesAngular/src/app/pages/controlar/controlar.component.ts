import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Transaction } from '../../models/data-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-controlar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './controlar.component.html',
  styleUrls: ['./controlar.component.css']
})
export class ControlarComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  
  // Formulário
  novaTransacao: Partial<Transaction> = {
    tipo: 'despesa',
    valor: 0,
    descricao: '',
    data: new Date(),
    categoria: 'outros'
  };
  
  categorias = [
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'moradia', label: 'Moradia' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'impostos', label: 'Impostos' },
    { value: 'investimentos', label: 'Investimentos' },
    { value: 'salario', label: 'Salário (Receita)' },
    { value: 'extra', label: 'Extra (Receita)' },
    { value: 'outros', label: 'Outros' }
  ];

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.transactions$ = this.financeService.getTransactions();
  }

  adicionarTransacao(): void {
    if (this.novaTransacao.valor! <= 0 || !this.novaTransacao.descricao || !this.novaTransacao.data) {
      alert('Preencha todos os campos obrigatórios com valores válidos.');
      return;
    }

    // A categoria de Receita deve ser restrita
    if (this.novaTransacao.tipo === 'receita' && !['salario', 'extra', 'outros'].includes(this.novaTransacao.categoria!)) {
        this.novaTransacao.categoria = 'extra';
    }
    
    // A categoria de Despesa deve ser restrita
    if (this.novaTransacao.tipo === 'despesa' && ['salario', 'extra'].includes(this.novaTransacao.categoria!)) {
        this.novaTransacao.categoria = 'outros';
    }

    this.financeService.addTransaction(this.novaTransacao as Omit<Transaction, 'id'>).subscribe(
      () => {
        this.resetForm();
        alert('Transação adicionada com sucesso!');
      },
      error => alert('Erro ao adicionar transação.')
    );
  }

  excluirTransacao(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.financeService.deleteTransaction(id).subscribe(
        () => alert('Transação excluída com sucesso!'),
        error => alert('Erro ao excluir transação.')
      );
    }
  }

  resetForm(): void {
    this.novaTransacao = {
      tipo: 'despesa',
      valor: 0,
      descricao: '',
      data: new Date(),
      categoria: 'outros'
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getNomeCategoria(categoria: string): string {
    const cat = this.categorias.find(c => c.value === categoria);
    return cat ? cat.label : categoria;
  }
}
