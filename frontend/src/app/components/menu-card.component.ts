import { Component, computed, Input, signal } from '@angular/core';
import { ProductCardComponent, Product } from './product-card.component';


export interface Menu { //temporary export for mock data
  id: number
  name: string,
  description: string,
  price: number,
  image: string,
  products: Product[]
}

@Component({
  selector: 'app-menu-card',
  imports: [ProductCardComponent],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.scss',
})
export class MenuCardComponent {
  @Input() menu : Menu = {
    id: 1,
    name : "Menu kebab",
    description: "Kebab + frites + boisson au choix",
    price: 10.0,
    image: '',
    products: [

    ]
  }

  expandedProductId = signal<number | null>(null);

  fallbackImage(event: Event) {
		(event.target as HTMLImageElement).src = '/assets/images/1.png';
	}
}
