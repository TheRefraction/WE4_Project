import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

export interface Ingredient {
  id: number;
  name: string;
  included: boolean;
}

export interface Extra {
  id: number;
  name: string;
  price: number;
  selected: boolean;
  type: 'supplement' | 'size' | 'sauce';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: Ingredient[];
  extras: Extra[];
  categoryIds?: number[];
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  @Input() product!: Product;
  @Input() inMenu: boolean = false;

  @Output() customizationChange = new EventEmitter<{ ingredients: Ingredient[]; extras: Extra[] }>();

  expanded = signal(false);
  ingredients = signal<Ingredient[]>([]);
  extras = signal<Extra[]>([]);
  addedFeedback = signal(false);

  ngOnInit() {
    this.resetToDefaults();
  }

  private resetToDefaults() {
    this.ingredients.set(this.product.ingredients.map(i => ({ ...i })));
    this.extras.set(this.product.extras.map(e => ({ ...e })));
  }

  totalPrice = computed(() => {
    const extrasTotal = this.extras()
      .filter(e => e.selected)
      .reduce((sum, e) => sum + e.price, 0);
    return (this.product.price + extrasTotal).toFixed(2);
  });

  get sizes() { return this.extras().filter(e => e.type === 'size'); }
  get supplements() { return this.extras().filter(e => e.type === 'supplement'); }
  get sauces() { return this.extras().filter(e => e.type === 'sauce'); }

  toggleIngredient(id: number) {
    this.ingredients.update(list =>
      list.map(i => i.id === id ? { ...i, included: !i.included } : i)
    );
    this.emitChange();
  }

  toggleSize(id: number) {
    this.extras.update(list =>
      list.map(e => e.type === 'size' ? { ...e, selected: e.id === id } : e)
    );
    this.emitChange();
  }

  toggleExtra(id: number) {
    this.extras.update(list =>
      list.map(e => e.id === id ? { ...e, selected: !e.selected } : e)
    );
    this.emitChange();
  }

  private emitChange() {
    if (this.inMenu) {
      this.customizationChange.emit({
        ingredients: this.ingredients(),
        extras: this.extras(),
      });
    }
  }

  addToCart() {
    this.cartService.addProduct(this.product, this.ingredients(), this.extras());
    console.log('[CartService] localStorage updated :', JSON.parse(localStorage.getItem('cart_items') ?? '[]'));
    this.addedFeedback.set(true);
    // Après l'anim : reset la custom et ferme le panneau
    setTimeout(() => {
      this.addedFeedback.set(false);
      this.expanded.set(false);
      this.resetToDefaults();
    }, 1200);
  }

  viewDetails() {
    if (!this.inMenu) {
      this.router.navigate(['/product', this.product.id]);
    }
  }

  fallbackImage(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/images/1.png';
  }
}
