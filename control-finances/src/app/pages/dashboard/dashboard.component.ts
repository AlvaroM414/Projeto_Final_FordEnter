import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private authService = inject(AuthService);

  nomeUsuario = 'Usuário';
  ultimoAcesso: string = new Date().toLocaleString();
  mesAtualFormatado: string = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  receitas = 0;
  despesas = 0;
  saldo = 0;
  dicaDoDia = 'Revise seus gastos mensais para identificar onde você pode economizar.';

  logout() {
    this.authService.logout();
  }
}