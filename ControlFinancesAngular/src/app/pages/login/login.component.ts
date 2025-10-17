import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = 'teste@controlfinances.com';
  senha = '123';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.senha).subscribe(success => {
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Credenciais inválidas. Tente novamente.';
      }
    });
  }
}
