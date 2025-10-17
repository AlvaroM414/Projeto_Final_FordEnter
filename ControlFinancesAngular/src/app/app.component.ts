import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  providers: [AuthService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ControlFinancesAngular';
  isLoggedIn = false;
  isLoginPage = false;
  private authSubscription!: Subscription;
  private routerSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}

