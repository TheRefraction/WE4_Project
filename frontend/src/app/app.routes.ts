import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { HomeComponent } from './home.component';
import { ShopComponent } from './shop.component';
import { CartComponent } from './cart.component';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'account', component: AccountComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent }
];
