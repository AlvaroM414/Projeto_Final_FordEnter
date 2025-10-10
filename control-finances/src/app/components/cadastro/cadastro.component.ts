
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UtilsService } from '../../core/services/utils.service';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private utilsService = inject(UtilsService);

  nome = '';
  email = '';
  senha = '';
  confirmaSenha = '';
  aceitarTermos = false;
  loading = false;
  
  forcaSenha = { width: '0%', color: '#ccc', label: '' };

  verificarForcaSenha(): void {
    let strength = 0;
    const senha = this.senha;

    if (senha.length >= 6) strength++;
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) strength++;
    if (/[0-9]/.test(senha)) strength++;
    if (/[^a-zA-Z0-9]/.test(senha)) strength++;

    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#27ae60'];
    const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
    const widths = ['20%', '40%', '60%', '80%', '100%'];
    
    if (senha.length === 0) {
      this.forcaSenha = { width: '0%', color: '#ccc', label: '' };
    } else {
      const index = Math.min(strength, 4);
      this.forcaSenha = {
        width: widths[index],
        color: colors[index],
        label: 'Força da senha: ' + labels[index]
      };
    }
  }

  fazerCadastro(): void {
    if (this.senha !== this.confirmaSenha) {
      this.utilsService.mostrarNotificacao('As senhas não coincidem.', 'danger');
      return;
    }
    if (!this.aceitarTermos) {
      this.utilsService.mostrarNotificacao('Você precisa aceitar os Termos de Uso.', 'warning');
      return;
    }

    this.loading = true;
    this.authService.fazerCadastro({ email: this.email, password: this.senha })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.utilsService.mostrarNotificacao('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const message = err.error?.message || 'Erro ao cadastrar. O e-mail já pode estar em uso.';
          this.utilsService.mostrarNotificacao(message, 'danger');
        }
      });
  }

  mostrarTermos(): void {
    this.utilsService.mostrarNotificacao('Termos de Uso: Este sistema é um protótipo para fins de demonstração.', 'info');
  }

  mostrarPrivacidade(): void {
    this.utilsService.mostrarNotificacao('Política de Privacidade: Seus dados são armazenados temporariamente para esta demonstração.', 'info');
  }
}
