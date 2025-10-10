import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UtilsService } from '../../core/services/utils.service';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private utilsService = inject(UtilsService);

  email = '';
  senha = '';
  loading = false;

  fazerLogin(): void {
    if (!this.email || !this.senha) {
      return;
    }
    this.loading = true;
    this.authService.fazerLogin({ email: this.email, password: this.senha })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.utilsService.mostrarNotificacao('Login realizado com sucesso!', 'success');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.utilsService.mostrarNotificacao('E-mail ou senha incorretos. Tente novamente.', 'danger');
        }
      });
  }

  esqueceuSenha(): void {
    const email = prompt('Digite seu e-mail para recuperação de senha:');
    if (email && this.utilsService.validarEmail(email)) {
      this.utilsService.mostrarNotificacao('Instruções de recuperação enviadas para ' + email, 'success');
    } else if (email) {
      this.utilsService.mostrarNotificacao('Por favor, digite um e-mail válido.', 'warning');
    }
  }
}