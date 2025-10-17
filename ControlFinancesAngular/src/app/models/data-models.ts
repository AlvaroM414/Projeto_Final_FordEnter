export interface User {
  id: string;
  nome: string;
  email: string;
  ultimoAcesso?: Date;
}

export interface Transaction {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  descricao: string;
  data: Date;
  categoria: string;
}

export interface Goal {
  id: string;
  nome: string;
  valor: number;
  valorAtual: number;
  dataAlvo: Date;
  concluida: boolean;
}

export interface Budget {
  id: string;
  mes: string; // Formato YYYY-MM
  categoria: string;
  limite: number;
  gasto: number;
  alerta: number; // Percentual para alerta
}

export interface DashboardSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  transacoesMes: number;
}
