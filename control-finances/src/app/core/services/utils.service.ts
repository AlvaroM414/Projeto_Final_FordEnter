
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {



  mostrarNotificacao(message: string, type: 'success' | 'danger' | 'warning' | 'info'): void {
    console.log(`[Notification - ${type}]: ${message}`);
    // In a real app, this would interact with a toast/snackbar component.
    alert(`[${type.toUpperCase()}]\n${message}`);
  }

  validarEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\\s@\"]+(\\.[^<>()[\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  formatarDataHora(date: Date): string {
    return date.toLocaleString('pt-BR');
  }

  obterMesAtual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  formatarMoeda(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
