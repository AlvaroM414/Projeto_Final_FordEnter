import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../models/data-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private mockUser: User = {
    id: 'u1',
    nome: 'Usuário Teste',
    email: 'teste@controlfinances.com',
    ultimoAcesso: new Date()
  };

  constructor(private router: Router) {
    // Tenta carregar o usuário do localStorage para manter o estado
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Simula um processo de login. Em um ambiente de produção, esta função
   * faria uma chamada a uma API de autenticação real.
   * Atualmente, aceita qualquer email e a senha '123'.
   */
  login(email: string, senha: string): Observable<boolean> {
    // Simulação de login: qualquer email e senha '123' funciona
    if (email && senha === '123') {
      const userToLogin = { ...this.mockUser, email: email, ultimoAcesso: new Date() };
      localStorage.setItem('currentUser', JSON.stringify(userToLogin));
      this.currentUserSubject.next(userToLogin);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
