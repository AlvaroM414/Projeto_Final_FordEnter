import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Transacao } from '../../models/transacao.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- Transacoes ---

  getTransacoes(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(`${this.apiUrl}/transacoes`, { headers: this.getHeaders() });
  }

  addTransacao(transacao: Omit<Transacao, 'id'>): Observable<Transacao> {
    return this.http.post<Transacao>(`${this.apiUrl}/transacoes`, transacao, { headers: this.getHeaders() });
  }

  removeTransacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transacoes/${id}`, { headers: this.getHeaders() });
  }

  // --- Métodos antigos (localStorage) ---
  // TODO: Migrar orcamentos e metas para o backend.

  carregarDados<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      console.error(`[DataService] Erro ao carregar e parsear dados para a chave: ${key}`, error);
      return null;
    }
  }

  salvarDados<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[DataService] Erro ao salvar dados para a chave: ${key}`, error);
    }
  }
}
