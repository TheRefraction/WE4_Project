import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from './services/cart.service';
import { OrderService } from './services/order.service';
import { AccountService } from './services/account.service';

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
  private orderService = inject(OrderService);
  private accountService = inject(AccountService);

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
    zip:       ['', Validators.required],
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

    if (!this.accountService.isLoggedIn()) {
      alert('Veuillez vous connecter pour passer commande.');
      this.router.navigate(['/login']);
      return;
    }

    const customerId = this.accountService.currentUser?.id || 1;

    const itemsMapped = this.items().map((item: any) => {
      if (item.type === 'product') {
        const prod = item.product;
        const options: any[] = [];
        
        prod.customization.ingredients.forEach((ing: any) => {
          if (!ing.included) {
            options.push({
              name: 'Ingrédient',
              item: {
                name: `Sans ${ing.name}`,
                delta: 0,
                quantity: 1
              }
            });
          }
        });

        prod.customization.extras.forEach((ext: any) => {
          if (ext.selected) {
            options.push({
              name: ext.type === 'size' ? 'Taille' : ext.type === 'sauce' ? 'Sauce' : 'Supplément',
              item: {
                name: ext.name,
                delta: ext.price,
                quantity: 1
              }
            });
          }
        });

        return {
          type: 'product',
          name: prod.name,
          price: prod.basePrice || prod.price,
          quantity: item.quantity,
          options
        };
      } else {
        const menu = item.menu;
        const slots = menu.customizations.map((cust: any) => {
          const options: any[] = [];
          
          cust.ingredients.forEach((ing: any) => {
            if (!ing.included) {
              options.push({
                name: 'Ingrédient',
                item: {
                  name: `Sans ${ing.name}`,
                  delta: 0,
                  quantity: 1
                }
              });
            }
          });

          cust.extras.forEach((ext: any) => {
            if (ext.selected) {
              options.push({
                name: ext.type === 'size' ? 'Taille' : ext.type === 'sauce' ? 'Sauce' : 'Supplément',
                item: {
                  name: ext.name,
                  delta: ext.price,
                  quantity: 1
                }
              });
            }
          });

          return {
            name: 'Sélection',
            item: {
              name: cust.productName,
              delta: 0,
              quantity: 1,
              options
            }
          };
        });

        return {
          type: 'menu',
          name: menu.name,
          price: menu.price,
          quantity: item.quantity,
          slots
        };
      }
    });

    const backendOrder = {
      customerId,
      amount: this.total(),
      billingAddress: {
        street: this.checkoutForm.value.address || '',
        city: this.checkoutForm.value.city || '',
        zip: this.checkoutForm.value.zip || '',
        country: 'France'
      },
      items: itemsMapped
    };

    this.orderService.placeOrder(backendOrder).subscribe({
      next: (res) => {
        const invoiceId = res.data.id;
        console.log('[Order] Commande soumise avec succès, ID:', invoiceId);

        this.orderService.makePayment(invoiceId, 'card').subscribe({
          next: () => {
            console.log('[Order] Paiement établi avec succès pour invoice:', invoiceId);
            this.cartService.clearCart();
            this.checkoutForm.reset();
            this.step.set('confirm');
          },
          error: (payErr) => {
            console.error('[Order] Erreur de paiement:', payErr);
            alert("Une erreur s'est produite lors du paiement. Veuillez réessayer.");
          }
        });
      },
      error: (err) => {
        console.error('[Order] Erreur de commande:', err);
        alert("Une erreur s'est produite lors de la soumission de la commande. Veuillez réessayer.");
      }
    });
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
