import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'account', component: AccountComponent}
];
