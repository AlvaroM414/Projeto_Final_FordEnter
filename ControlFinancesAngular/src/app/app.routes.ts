import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ControlarComponent } from './pages/controlar/controlar.component';
import { PlanejamentoComponent } from './pages/planejamento/planejamento.component';
import { ImpostosComponent } from './pages/impostos/impostos.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'controlar', component: ControlarComponent, canActivate: [authGuard] },
    { path: 'planejamento', component: PlanejamentoComponent, canActivate: [authGuard] },
    { path: 'impostos', component: ImpostosComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' } // Rota curinga para redirecionar
];
