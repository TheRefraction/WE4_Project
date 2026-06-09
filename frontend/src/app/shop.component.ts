import { Component } from '@angular/core';
import { ProductCardComponent } from './components/product-card.component';


@Component({
  selector: 'shop',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
}
