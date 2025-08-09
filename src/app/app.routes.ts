import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { TransactionList } from './pages/transaction/transaction-list/transaction-list';
import { TransactionAdd } from './pages/transaction/transaction-add/transaction-add';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  {path: 'transaction-list', component: TransactionList, canActivate: [AuthGuard]},
  {path: 'add-transaction', component: TransactionAdd, canActivate: [AuthGuard]},
  {path: 'edit-transaction/:id', component: TransactionAdd, canActivate: [AuthGuard]},

  { path: '**', redirectTo: '/login' }
];
