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
  ingredients = signal<Ingredient[]>([]);
  extras = signal<Extra[]>([]);
  addedFeedback = signal(false);

  totalPrice = computed(() => {
    const prod = this.product();
    if (!prod) return '0.00';
    const extrasTotal = this.extras()
      .filter(e => e.selected)
      .reduce((sum, e) => sum + e.price, 0);
    return (prod.price + extrasTotal).toFixed(2);
  });

  get sizes() { return this.extras().filter(e => e.type === 'size'); }
  get supplements() { return this.extras().filter(e => e.type === 'supplement'); }
  get sauces() { return this.extras().filter(e => e.type === 'sauce'); }

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
    this.productService.getProductFull(id).subscribe({
      next: (res) => {
        if (res.data) {
          const mapped = this.mapProduct(res.data);
          this.product.set(mapped);
          this.ingredients.set(mapped.ingredients.map(i => ({ ...i })));
          this.extras.set(mapped.extras.map(e => ({ ...e })));
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

  private mapProduct(backendProduct: any): Product {
    const ingredients: Ingredient[] = [];
    const extras: Extra[] = [];

    if (backendProduct.customizations && Array.isArray(backendProduct.customizations)) {
      for (const slot of backendProduct.customizations) {
        const catName = (slot.categoryName || '').toLowerCase();
        if (catName === 'ingrédients' || catName === 'ingredients') {
          if (slot.options && Array.isArray(slot.options)) {
            for (const opt of slot.options) {
              ingredients.push({
                id: opt.productId,
                name: opt.name,
                included: opt.isDefault
              });
            }
          }
        } else {
          if (slot.options && Array.isArray(slot.options)) {
            for (const opt of slot.options) {
              let type: 'supplement' | 'size' | 'sauce' = 'supplement';
              if (catName === 'taille' || catName === 'size') {
                type = 'size';
              } else if (catName === 'sauces' || catName === 'sauce') {
                type = 'sauce';
              }
              extras.push({
                id: opt.productId,
                name: opt.name,
                price: parseFloat(opt.priceDelta),
                selected: opt.isDefault,
                type: type
              });
            }
          }
        }
      }
    }

    return {
      id: backendProduct.id,
      name: backendProduct.name,
      description: backendProduct.description || '',
      price: parseFloat(backendProduct.price),
      image: backendProduct.pictureUrl || '',
      ingredients,
      extras
    };
  }

  toggleIngredient(id: number) {
    this.ingredients.update(list =>
      list.map(i => i.id === id ? { ...i, included: !i.included } : i)
    );
  }

  toggleSize(id: number) {
    this.extras.update(list =>
      list.map(e => e.type === 'size' ? { ...e, selected: e.id === id } : e)
    );
  }

  toggleExtra(id: number) {
    this.extras.update(list =>
      list.map(e => e.id === id ? { ...e, selected: !e.selected } : e)
    );
  }

  addToCart() {
    const prod = this.product();
    if (!prod) return;
    this.cartService.addProduct(prod, this.ingredients(), this.extras());
    this.addedFeedback.set(true);
    setTimeout(() => {
      this.addedFeedback.set(false);
    }, 1200);
  }

  fallbackImage(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/images/1.png';
  }
}
