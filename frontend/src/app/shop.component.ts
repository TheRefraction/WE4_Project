import { Component, Input , signal, computed} from '@angular/core';
import { ProductCardComponent, Product } from './components/product-card.component';
import { MenuCardComponent, Menu } from './components/menu-card.component';
import { PRODUCTS, MENUS } from './mock-data';

export interface Shop {
  products: Product[],
  menus: Menu[]
}

@Component({
  selector: 'shop',
  standalone: true,
  imports: [ProductCardComponent, MenuCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  @Input() shop : Shop = {
      products : PRODUCTS,
      menus: MENUS
  }

  anyExpanded = signal(false);
  closeAll() { this.anyExpanded.set(false); }
}

