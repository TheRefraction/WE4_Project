import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { HomeComponent } from './home.component';
import { ShopComponent } from './shop.component';
import { CartComponent } from './cart.component';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ProductDetailComponent } from './product-detail.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'account', component: AccountComponent, canActivate: [authGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] }
];
