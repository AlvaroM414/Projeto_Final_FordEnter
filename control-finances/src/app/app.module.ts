import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculadoraImpostoComponent } from './pages/calculadora-imposto/calculadora-imposto.component';
import { ControleFinancasComponent } from './pages/controle-financas/controle-financas.component';
import { PlanejamentoComponent } from './pages/planejamento-financeiro/planejamento-financeiro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculadoraImpostoComponent,
    ControleFinancasComponent,
    PlanejamentoComponent,
    DashboardComponent,
    LoginComponent,
    CadastroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // ← Fornece ngModel, ngForm
    CommonModule // ← Fornece *ngIf, *ngFor, pipes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }