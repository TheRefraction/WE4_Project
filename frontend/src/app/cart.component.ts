import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from './services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);

  items = this.cartService.items;
  total = this.cartService.total;
  itemCount = this.cartService.itemCount;

  step = signal<'cart' | 'checkout' | 'confirm'>('cart');

  checkoutForm = this.fb.group({
    firstName:   ['', Validators.required],
    lastName:    ['', Validators.required],
    email:       ['', [Validators.required, Validators.email]],
    address:     ['', Validators.required],
    city:        ['', Validators.required],
    zip:         ['', Validators.required],
    cardNumber:  ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    cardExpiry:  ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cardCvc:     ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });


  summaryIngredients(ingredients: { name: string; included: boolean }[]): string {
    const removed = ingredients.filter(i => !i.included).map(i => i.name);
    return removed.length ? `Sans ${removed.join(', ')}` : '';
  }

  summaryExtras(extras: { name: string; selected: boolean; type: string }[]): string {
    const size = extras.find(e => e.type === 'size' && e.selected);
    const active = extras.filter(e => e.type !== 'size' && e.selected).map(e => e.name);
    return [size?.name, ...active].filter(Boolean).join(' · ');
  }

  productNameInMenu(item: CartItem, productId: number): string {
    return `Produit ${productId}`;
  }

  goToCheckout() {
    if (this.items().length > 0) this.step.set('checkout');
  }

  backToCart() {
    this.step.set('cart');
  }


  submitOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const order = {
      customer: {
        firstName: this.checkoutForm.value.firstName,
        lastName:  this.checkoutForm.value.lastName,
        email:     this.checkoutForm.value.email,
        address:   this.checkoutForm.value.address,
        city:      this.checkoutForm.value.city,
        zip:       this.checkoutForm.value.zip,
      },
      payment: {
        cardNumber: this.checkoutForm.value.cardNumber,
        cardExpiry: this.checkoutForm.value.cardExpiry,
        cardCvc:    this.checkoutForm.value.cardCvc,
      },
      items: this.items(),
      total: this.total(),
    };

    console.log('[Order] Commande soumise :', order);

    this.cartService.clearCart();
    this.checkoutForm.reset();
    this.step.set('confirm');
  }

  restartShopping() {
    this.router.navigate(['']);
  }


  fieldInvalid(name: string): boolean {
    const ctrl = this.checkoutForm.get(name);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 16);
    this.checkoutForm.patchValue({ cardNumber: input.value });
  }

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
    input.value = val;
    this.checkoutForm.patchValue({ cardExpiry: val });
  }
}
