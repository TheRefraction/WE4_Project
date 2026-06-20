import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent, Product, Ingredient, Extra } from './product-card.component';
import { CartService, CartMenuCustomization } from '../services/cart.service';

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  products: Product[];
}

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.scss',
})
export class MenuCardComponent {
  private cartService = inject(CartService);

  @Input() menu!: Menu;

  expandedProductId: number | null = null;
  addedFeedback = signal(false);

  private customizationsMap = signal<Map<number, CartMenuCustomization>>(new Map());

  ngOnInit() {
    this.resetToDefaults();
  }

  private resetToDefaults() {
    const map = new Map<number, CartMenuCustomization>();
    for (const product of this.menu.products) {
      map.set(product.id, {
        productId: product.id,
        productName: product.name,
        ingredients: product.ingredients.map(i => ({ ...i })),
        extras: product.extras.map(e => ({ ...e })),
      });
    }
    this.customizationsMap.set(map);
  }

  onProductCustomizationChange(
    productId: number,
    change: { ingredients: Ingredient[]; extras: Extra[] }
  ) {
    this.customizationsMap.update(map => {
      const next = new Map(map);
      next.set(productId, {
        productId,
        productName: map.get(productId)?.productName ?? '',
        ingredients: change.ingredients,
        extras: change.extras,
      });
      return next;
    });
  }

  menuPrice = computed(() => {
    const customizations = Array.from(this.customizationsMap().values());
    return this.cartService.computeMenuPrice(this.menu, customizations).toFixed(2);
  });

  addToCart() {
    const customizations = Array.from(this.customizationsMap().values());
    this.cartService.addMenu(this.menu, customizations);
    this.addedFeedback.set(true);
    setTimeout(() => {
      this.addedFeedback.set(false);
      this.expandedProductId = null;
      this.resetToDefaults();
    }, 1200);
  }

  fallbackImage(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/images/1.png';
  }
}
