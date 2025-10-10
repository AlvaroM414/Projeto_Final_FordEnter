import { Component, OnInit } from '@angular/core';

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  tipo: 'receita' | 'despesa';
}

@Component({
  selector: 'app-controle-financas',
  templateUrl: './controlar.component.html',
  styleUrls: ['./controlar.component.css']
})
export class ControleFinancasComponent implements OnInit {
  novaTransacao: Partial<Transacao> = {
    descricao: '',
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    categoria: '',
    tipo: 'despesa'
  };

  transacoes: Transacao[] = [];
  transacoesFiltradas: Transacao[] = [];
  
  filtroCategoria: string = '';
  filtroMes: string = '';
  
  categorias: string[] = [
    'alimentacao', 'moradia', 'transporte', 'saude', 
    'educacao', 'lazer', 'salario', 'investimentos'
  ];
  
  meses: string[] = [
    '2024-01', '2024-02', '2024-03', '2024-04',
    '2024-05', '2024-06', '2024-07', '2024-08'
  ];

  totalReceitas: number = 0;
  totalDespesas: number = 0;
  saldo: number = 0;

  ngOnInit() {
    this.carregarTransacoes();
    this.filtrarTransacoes();
  }

  adicionarTransacao(): void {
    if (!this.novaTransacao.descricao || !this.novaTransacao.categoria) return;

    const transacao: Transacao = {
      id: Date.now(),
      descricao: this.novaTransacao.descricao!,
      valor: this.novaTransacao.valor!,
      data: this.novaTransacao.data!,
      categoria: this.novaTransacao.categoria!,
      tipo: this.novaTransacao.tipo!
    };

    this.transacoes.push(transacao);
    this.filtrarTransacoes();
    this.limparFormulario();
  }

  removerTransacao(id: number): void {
    this.transacoes = this.transacoes.filter(t => t.id !== id);
    this.filtrarTransacoes();
  }

  filtrarTransacoes(): void {
    let filtered = this.transacoes;

    if (this.filtroCategoria) {
      filtered = filtered.filter(t => t.categoria === this.filtroCategoria);
    }

    if (this.filtroMes) {
      filtered = filtered.filter(t => t.data.startsWith(this.filtroMes));
    }

    this.transacoesFiltradas = filtered;
    this.calcularResumo();
  }

  private calcularResumo(): void {
    this.totalReceitas = this.transacoesFiltradas
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);

    this.totalDespesas = this.transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);

    this.saldo = this.totalReceitas - this.totalDespesas;
  }

  private limparFormulario(): void {
    this.novaTransacao = {
      descricao: '',
      valor: 0,
      data: new Date().toISOString().split('T')[0],
      categoria: '',
      tipo: 'despesa'
    };
  }

  private carregarTransacoes(): void {
    this.transacoes = [
      {
        id: 1,
        descricao: 'Salário',
        valor: 3000,
        data: '2024-10-01',
        categoria: 'salario',
        tipo: 'receita'
      },
      {
        id: 2,
        descricao: 'Aluguel',
        valor: 1200,
        data: '2024-10-05',
        categoria: 'moradia',
        tipo: 'despesa'
      }
    ];
  }
}