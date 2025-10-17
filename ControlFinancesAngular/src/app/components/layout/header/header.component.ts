import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private userSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(event: MouseEvent): void {
    event.preventDefault();
    this.authService.logout();
  }
}
