import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ControleFinancasComponent } from './pages/controle-financas/controle-financas.component';
import { CalculadoraImpostoComponent } from './pages/calculadora-imposto/calculadora-imposto.component';
import { PlanejamentoComponent } from './pages/planejamento-financeiro/planejamento-financeiro.component';

export const routes: Routes = [ // ← Note o 'export'
  { path: '', component: DashboardComponent },
  { path: 'controle-financas', component: ControleFinancasComponent },
  { path: 'calculadora-imposto', component: CalculadoraImpostoComponent },
  { path: 'planejamento', component: PlanejamentoComponent }
];