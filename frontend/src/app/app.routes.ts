import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { HomeComponent } from './home.component';
import { ShopComponent } from './shop.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'account', component: AccountComponent},
  { path: 'shop', component: ShopComponent }
];
