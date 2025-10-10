import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../core/services/utils.service';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Orcamento {
  id: number;
  mes: string;
  categoria: string;
  limite: number;
  alerta: number;
  gastoAtual: number;
}

interface Meta {
  id: number;
  nome: string;
  categoria: string;
  valorTotal: number;
  valorAtual: number;
  dataAlvo: string;
  aporteMensalNecessario: number;
}

interface ResultadoProjecao {
  valorFinal: number;
  tabela: { mes: number, saldo: number }[];
}

@Component({
  selector: 'app-planejamento',
  templateUrl: './planejamento-financeiro.component.html',
  styleUrls: ['./planejamento-financeiro.component.css']
})
export class PlanejamentoComponent implements OnInit {
  private utilsService = inject(UtilsService);
  private dataService = inject(DataService);

  orcamentos: Orcamento[] = [];
  mesOrcamento = '';
  categoriaOrcamento = '';
  limiteOrcamento = 0;
  alertaOrcamento = 70;
  
  metas: Meta[] = [];
  nomeMeta = '';
  categoriaMeta = '';
  valorTotalMeta = 0;
  valorAtualMeta = 0;
  dataAlvoMeta = '';
  
  valorInicialProjecao = 0;
  periodoProjecao = 12;
  taxaJuros = 0;
  aporteMensal = 0;
  resultadoProjecao: ResultadoProjecao | null = null;
  
  totalMetasAtivas = 0;
  totalEconomizado = 0;
  totalOrcamentos = 0;

  constructor() {
    this.mesOrcamento = this.utilsService.obterMesAtual();
  }

  ngOnInit(): void {
    this.carregarDadosPlanejamento();
    this.atualizarEstatisticas();
  }
  
  carregarDadosPlanejamento(): void {
    this.orcamentos = this.dataService.carregarDados('orcamentos') || [];
    this.metas = this.dataService.carregarDados('metas') || [];
  }

  atualizarEstatisticas(): void {
    this.totalMetasAtivas = this.metas.length;
    this.totalOrcamentos = this.orcamentos.length;
    this.totalEconomizado = this.metas.reduce((sum, m) => sum + m.valorAtual, 0);
  }

  adicionarOrcamento(): void {
    if (!this.categoriaOrcamento || !this.limiteOrcamento || this.limiteOrcamento <= 0) {
      this.utilsService.mostrarNotificacao('Preencha os campos de Orçamento corretamente.', 'warning');
      return;
    }
    
    const novoOrcamento: Orcamento = {
      id: Date.now(),
      mes: this.mesOrcamento,
      categoria: this.categoriaOrcamento,
      limite: this.limiteOrcamento,
      alerta: this.alertaOrcamento,
      gastoAtual: 0
    };

    const existe = this.orcamentos.find(o => o.mes === this.mesOrcamento && o.categoria === this.categoriaOrcamento);

    if (existe) {
      this.utilsService.mostrarNotificacao('Orçamento para esta categoria neste mês já existe!', 'warning');
      return;
    }

    this.orcamentos.push(novoOrcamento);
    this.dataService.salvarDados('orcamentos', this.orcamentos);
    this.atualizarEstatisticas();
    this.utilsService.mostrarNotificacao('Orçamento adicionado com sucesso!', 'success');
  }

  removerOrcamento(id: number): void {
    this.orcamentos = this.orcamentos.filter(o => o.id !== id);
    this.dataService.salvarDados('orcamentos', this.orcamentos);
    this.atualizarEstatisticas();
    this.utilsService.mostrarNotificacao('Orçamento removido.', 'info');
  }
  
  getNomeCategoriaOrcamento(categoria: string): string {
    const categorias: Record<string, string> = {
      'moradia': ' Moradia',
      'alimentacao': ' Alimentação',
      'outros': ' Outros'
    };
    return categorias[categoria] || categoria;
  }

  adicionarMeta(): void {
    if (!this.nomeMeta || !this.valorTotalMeta || !this.dataAlvoMeta) {
      this.utilsService.mostrarNotificacao('Preencha todos os campos da Meta.', 'warning');
      return;
    }
    
    const meta: Meta = {
      id: Date.now(),
      nome: this.nomeMeta,
      categoria: this.categoriaMeta,
      valorTotal: this.valorTotalMeta,
      valorAtual: this.valorAtualMeta,
      dataAlvo: this.dataAlvoMeta,
      aporteMensalNecessario: this.calcularAporteMensal(this.valorTotalMeta, this.valorAtualMeta, this.dataAlvoMeta)
    };

    this.metas.push(meta);
    this.dataService.salvarDados('metas', this.metas);
    this.atualizarEstatisticas();
    this.utilsService.mostrarNotificacao('Meta adicionada e aporte mensal calculado!', 'success');
  }

  removerMeta(id: number): void {
    this.metas = this.metas.filter(m => m.id !== id);
    this.dataService.salvarDados('metas', this.metas);
    this.atualizarEstatisticas();
    this.utilsService.mostrarNotificacao('Meta removida.', 'info');
  }
  
  calcularAporteMensal(valorTotal: number, valorAtual: number, dataAlvo: string): number {
      const dataAtual = new Date();
      const alvo = new Date(dataAlvo + '-01');
      const diffMeses = (alvo.getFullYear() - dataAtual.getFullYear()) * 12 + (alvo.getMonth() - dataAtual.getMonth());
      const valorRestante = valorTotal - valorAtual;
      if (diffMeses <= 0 || valorRestante <= 0) return valorRestante > 0 ? valorRestante : 0;
      return valorRestante / diffMeses;
  }

  calcularProjecao(): void {
    let valorAtual = this.valorInicialProjecao;
    const taxa = this.taxaJuros / 100;
    const aportes = this.aporteMensal;
    const meses = this.periodoProjecao;
    const projecao: { mes: number, saldo: number }[] = [];

    this.resultadoProjecao = null;
    
    for (let i = 1; i <= meses; i++) {
        valorAtual = (valorAtual + aportes) * (1 + taxa);
        projecao.push({ mes: i, saldo: valorAtual });
    }

    this.resultadoProjecao = {
      valorFinal: valorAtual,
      tabela: projecao
    };
    
    this.utilsService.mostrarNotificacao('Projeção calculada com sucesso!', 'success');
  }
}