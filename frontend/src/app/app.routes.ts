import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { HomeComponent } from './home.component';
import { ShopComponent } from './shop.component';
import { CartComponent } from './cart.component';
import { AdminComponent } from './admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'account', component: AccountComponent},
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent }
];
