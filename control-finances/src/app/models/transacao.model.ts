export interface Transacao {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  formaPagamento: string;
}
