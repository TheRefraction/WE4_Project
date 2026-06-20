import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent, Product, Ingredient, Extra } from './product-card.component';
import { CartService, CartMenuCustomization } from '../services/cart.service';

export interface MenuSlot {
  id: number;
  name: string;
  minSelect: number;
  maxSelect: number;
  displayOrder: number;
  products: (Product & { priceDelta: number; isDefault: boolean })[];
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  pictureUrl?: string;
  products?: Product[];
  slots?: MenuSlot[];
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

  expandedSlotId = signal<number | null>(null);
  addedFeedback = signal(false);

  selectedProductIds = signal<Map<number, number>>(new Map());
  private customizationsMap = signal<Map<number, CartMenuCustomization>>(new Map());

  // Unified slots accessor, falls back to building one slot from flat products list
  slots = computed(() => {
    if (this.menu.slots && this.menu.slots.length > 0) {
      return this.menu.slots;
    }
    if (this.menu.products && this.menu.products.length > 0) {
      return [{
        id: 0,
        name: 'Sélection',
        minSelect: 1,
        maxSelect: 1,
        displayOrder: 0,
        products: this.menu.products.map((p, idx) => ({
          ...p,
          priceDelta: 0,
          isDefault: idx === 0
        }))
      }];
    }
    return [];
  });

  ngOnInit() {
    this.resetToDefaults();
  }

  private resetToDefaults() {
    const selProductIds = new Map<number, number>();
    const map = new Map<number, CartMenuCustomization>();

    for (const slot of this.slots()) {
      const defaultProd = slot.products.find(p => p.isDefault) || slot.products[0];
      if (defaultProd) {
        selProductIds.set(slot.id, defaultProd.id);
        map.set(slot.id, {
          slotId: slot.id,
          slotName: slot.name,
          productId: defaultProd.id,
          productName: defaultProd.name,
          priceDelta: defaultProd.priceDelta || 0,
          ingredients: defaultProd.ingredients.map(i => ({ ...i })),
          extras: defaultProd.extras.map(e => ({ ...e })),
        });
      }
    }

    this.selectedProductIds.set(selProductIds);
    this.customizationsMap.set(map);
  }

  onSlotProductChange(slotId: number, productId: number) {
    const slot = this.slots().find(s => s.id === slotId);
    if (!slot) return;
    const prod = slot.products.find(p => p.id === productId);
    if (!prod) return;

    this.selectedProductIds.update(ids => {
      const next = new Map(ids);
      next.set(slotId, productId);
      return next;
    });

    this.customizationsMap.update(map => {
      const next = new Map(map);
      next.set(slotId, {
        slotId,
        slotName: slot.name,
        productId: prod.id,
        productName: prod.name,
        priceDelta: prod.priceDelta || 0,
        ingredients: prod.ingredients.map(i => ({ ...i })),
        extras: prod.extras.map(e => ({ ...e })),
      });
      return next;
    });
  }

  onProductCustomizationChange(
    slotId: number,
    change: { ingredients: Ingredient[]; extras: Extra[] }
  ) {
    this.customizationsMap.update(map => {
      const next = new Map(map);
      const existing = next.get(slotId);
      if (existing) {
        next.set(slotId, {
          ...existing,
          ingredients: change.ingredients,
          extras: change.extras,
        });
      }
      return next;
    });
  }

  getSelectedProductForSlot(slotId: number): (Product & { priceDelta: number; isDefault: boolean }) | null {
    const slot = this.slots().find(s => s.id === slotId);
    if (!slot) return null;
    const productId = this.selectedProductIds().get(slotId);
    return slot.products.find(p => p.id === productId) || null;
  }

  parseInt(val: string): number {
    return parseInt(val, 10);
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
      this.expandedSlotId.set(null);
      this.resetToDefaults();
    }, 1200);
  }

  fallbackImage(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/images/1.png';
  }
}
