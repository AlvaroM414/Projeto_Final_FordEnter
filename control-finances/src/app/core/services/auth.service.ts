import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'usuarioLogado';

  fazerCadastro(credentials: { email: string, password: string, name?: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/register', credentials);
  }

  fazerLogin(credentials: { email: string, password: string }): Observable<{ token: string, user?: any }> {
    return this.http.post<{ token: string, user?: any }>('/api/auth/login', credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          if (response.user) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          }
        }
      })
    );
  }

  // MÉTODO UNIFICADO DE LOGOUT - remove apenas um
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // REMOVER método duplicado - manter apenas um logout
  // fazerLogout(): void {
  //   this.logout();
  // }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}