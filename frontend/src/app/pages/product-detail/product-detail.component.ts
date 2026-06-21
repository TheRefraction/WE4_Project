/**
 * product-detail.component.ts
 */

import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Ingredient, Extra } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  selectedOptions = signal<Record<number, Record<number, number>>>({}); // slotId -> { productId -> quantity }
  addedFeedback = signal(false);

  totalPrice = computed(() => {
    const prod = this.product();
    if (!prod) return '0.00';
    let price = prod.price;
    const selection = this.selectedOptions();
    if (prod.customizations) {
      for (const slot of prod.customizations) {
        const slotSelections = selection[slot.id] || {};
        for (const opt of slot.options) {
          const qty = slotSelections[opt.productId] || 0;
          price += parseFloat(opt.priceDelta || '0') * qty;
        }
      }
    }
    return price.toFixed(2);
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const id = parseInt(idStr, 10);
        this.loadProductDetails(id);
      }
    });
  }

  loadProductDetails(id: number) {
    this.productService.getProductDetail(id).subscribe({
      next: (res) => {
        if (res.data) {
          const mapped = this.mapProduct(res.data);
          this.product.set(mapped);
          this.resetToDefaults(mapped);
        } else {
          alert('Produit non trouvé.');
          this.router.navigate(['/shop']);
        }
      },
      error: (err) => {
        console.error('Failed to load product detail:', err);
        this.router.navigate(['/shop']);
      }
    });
  }

  private resetToDefaults(prod: Product) {
    const defaults: Record<number, Record<number, number>> = {};
    if (prod.customizations) {
      for (const slot of prod.customizations) {
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
    const prod = this.product();
    if (!prod || !prod.customizations) return true;
    const selection = this.selectedOptions();
    for (const slot of prod.customizations) {
      const slotSelections = selection[slot.id] || {};
      const totalQty = Object.values(slotSelections).reduce((sum, qty) => sum + qty, 0);
      if (totalQty < slot.minSelect || totalQty > slot.maxSelect) {
        return false;
      }
    }
    return true;
  });

  private mapProduct(backendProduct: any): Product {
    return {
      id: backendProduct.id,
      name: backendProduct.name,
      description: backendProduct.description || '',
      price: parseFloat(backendProduct.price),
      image: backendProduct.pictureUrl || '',
      customizations: backendProduct.customizations || [],
      ingredients: [],
      extras: [],
      categoryIds: (backendProduct.categories || []).map((c: any) => c.id)
    };
  }

  addToCart() {
    const prod = this.product();
    if (!prod || !this.isCustomizationValid()) return;

    const ingredients: Ingredient[] = [];
    const extras: Extra[] = [];

    if (prod.customizations) {
      for (const slot of prod.customizations) {
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

    this.cartService.addProduct(prod, ingredients, extras);
    this.addedFeedback.set(true);
    setTimeout(() => {
      this.addedFeedback.set(false);
    }, 1200);
  }

  fallbackImage(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/images/1.png';
  }
}
