
import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  title = 'controlfinances';

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
