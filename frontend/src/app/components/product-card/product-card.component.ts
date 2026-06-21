import { Component, Input, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

export interface Ingredient {
  id: number;
  name: string;
  included: boolean;
  quantity?: number;
}

export interface Extra {
  id: number;
  name: string;
  price: number;
  selected: boolean;
  type: 'supplement' | 'size' | 'sauce';
  categoryName?: string;
  quantity?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: Ingredient[];
  extras: Extra[];
  customizations?: any[];
  categoryIds?: number[];
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);

  @Input() product!: Product;

  expanded = signal(false);
  selectedOptions = signal<Record<number, Record<number, number>>>({}); // slotId -> { productId -> quantity }
  addedFeedback = signal(false);

  ngOnInit() {
    this.resetToDefaults();
  }

  private resetToDefaults() {
    const defaults: Record<number, Record<number, number>> = {};
    if (this.product.customizations) {
      for (const slot of this.product.customizations) {
        defaults[slot.id] = {};
        for (const opt of slot.options) {
          defaults[slot.id][opt.productId] = opt.isDefault ? 1 : 0;
        }
      }
    }
    this.selectedOptions.set(defaults);
  }

  getOptionQuantity(slotId: number, optionId: number): number {
    const slotSelections = this.selectedOptions()[slotId];
    return slotSelections ? (slotSelections[optionId] || 0) : 0;
  }

  isOptionSelected(slotId: number, optionId: number): boolean {
    return this.getOptionQuantity(slotId, optionId) > 0;
  }

  getSlotTotalQuantity(slot: any): number {
    const slotSelections = this.selectedOptions()[slot.id] || {};
    return Object.values(slotSelections).reduce((sum, qty) => sum + qty, 0);
  }

  isSlotAtMax(slot: any): boolean {
    return this.getSlotTotalQuantity(slot) >= slot.maxSelect;
  }

  incrementOption(slot: any, opt: any) {
    const slotId = slot.id;
    const optionId = opt.productId;
    const total = this.getSlotTotalQuantity(slot);
    if (total < slot.maxSelect) {
      this.selectedOptions.update(map => {
        const slotSelections = { ...(map[slotId] || {}) };
        slotSelections[optionId] = (slotSelections[optionId] || 0) + 1;
        return {
          ...map,
          [slotId]: slotSelections
        };
      });
    }
  }

  decrementOption(slot: any, opt: any) {
    const slotId = slot.id;
    const optionId = opt.productId;
    const currentQty = this.getOptionQuantity(slotId, optionId);
    if (currentQty > 0) {
      this.selectedOptions.update(map => {
        const slotSelections = { ...(map[slotId] || {}) };
        slotSelections[optionId] = currentQty - 1;
        return {
          ...map,
          [slotId]: slotSelections
        };
      });
    }
  }

  toggleOption(slot: any, opt: any) {
    const slotId = slot.id;
    const optionId = opt.productId;
    const currentQty = this.getOptionQuantity(slotId, optionId);

    if (slot.maxSelect === 1) {
      if (currentQty > 0) {
        if (slot.minSelect === 1) {
          return;
        }
        this.selectedOptions.update(map => ({
          ...map,
          [slotId]: { [optionId]: 0 }
        }));
      } else {
        this.selectedOptions.update(map => ({
          ...map,
          [slotId]: { [optionId]: 1 }
        }));
      }
    } else {
      if (currentQty > 0) {
        this.decrementOption(slot, opt);
      } else {
        this.incrementOption(slot, opt);
      }
    }
  }

  isIngredientSlot(slot: any): boolean {
    return (slot.categoryName || '').toLowerCase().includes('ingred');
  }

  parseFloat(val: any): number {
    return parseFloat(val) || 0;
  }

  isCustomizationValid = computed(() => {
    if (!this.product.customizations) return true;
    const selection = this.selectedOptions();
    for (const slot of this.product.customizations) {
      const slotSelections = selection[slot.id] || {};
      const totalQty = Object.values(slotSelections).reduce((sum, qty) => sum + qty, 0);
      if (totalQty < slot.minSelect || totalQty > slot.maxSelect) {
        return false;
      }
    }
    return true;
  });

  totalPrice = computed(() => {
    let price = this.product.price;
    const selection = this.selectedOptions();
    if (this.product.customizations) {
      for (const slot of this.product.customizations) {
        const slotSelections = selection[slot.id] || {};
        for (const opt of slot.options) {
          const qty = slotSelections[opt.productId] || 0;
          price += parseFloat(opt.priceDelta || '0') * qty;
        }
      }
    }
    return price.toFixed(2);
  });

  addToCart() {
    if (!this.isCustomizationValid()) return;

    const ingredients: Ingredient[] = [];
    const extras: Extra[] = [];

    if (this.product.customizations) {
      for (const slot of this.product.customizations) {
        const isIng = this.isIngredientSlot(slot);
        const slotSelections = this.selectedOptions()[slot.id] || {};

        for (const opt of slot.options) {
          const qty = slotSelections[opt.productId] || 0;
          const isSelected = qty > 0;
          if (isIng) {
            ingredients.push({
              id: opt.productId,
              name: opt.name,
              included: isSelected,
              quantity: qty
            });
          } else {
            let type: 'supplement' | 'size' | 'sauce' = 'supplement';
            const catName = (slot.categoryName || '').toLowerCase();
            if (catName.includes('taille') || catName.includes('size')) {
              type = 'size';
            } else if (catName.includes('sauce')) {
              type = 'sauce';
            }
            extras.push({
              id: opt.productId,
              name: opt.name,
              price: parseFloat(opt.priceDelta),
              selected: isSelected,
              type: type,
              categoryName: slot.categoryName,
              quantity: qty
            });
          }
        }
      }
    }

    this.cartService.addProduct(this.product, ingredients, extras);
    console.log('[CartService] localStorage updated :', JSON.parse(localStorage.getItem('cart_items') ?? '[]'));
    this.addedFeedback.set(true);
    setTimeout(() => {
      this.addedFeedback.set(false);
      this.expanded.set(false);
      this.resetToDefaults();
    }, 1200);
  }

  viewDetails() {
    this.router.navigate(['/product', this.product.id]);
  }

  fallbackImage(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/images/1.png';
  }
}
