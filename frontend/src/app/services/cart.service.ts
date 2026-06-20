import { Injectable, signal, computed } from '@angular/core';
import { Product, Ingredient, Extra } from '../components/product-card.component';
import { Menu } from '../components/menu-card.component';


export interface CartProductEntry {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  basePrice: number;
  customization: {
    ingredients: Ingredient[];
    extras: Extra[];
  };
}

export interface CartMenuCustomization {
  slotId: number;
  slotName: string;
  productId: number;
  productName: string;
  priceDelta: number;
  ingredients: Ingredient[];
  extras: Extra[];
}

export interface CartMenuEntry {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  customizations: CartMenuCustomization[];
}

export interface CartItem {
  cartItemId: string;
  type: 'product' | 'menu';
  quantity: number;
  product?: CartProductEntry;
  menu?: CartMenuEntry;
}


@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';

  private _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly total = computed(() =>
    this._items().reduce((sum, item) => {
      const price = item.type === 'product' ? item.product!.price : item.menu!.price;
      return sum + price * item.quantity;
    }, 0)
  );

  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );


  private hash(data: object): string {
    const str = JSON.stringify(data);
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
      h = h >>> 0;
    }
    return h.toString(36);
  }

  private productCartId(productId: number, ingredients: Ingredient[], extras: Extra[]): string {
    return `p_${this.hash({
      productId,
      ing: ingredients.map(i => ({ id: i.id, on: i.included })),
      ext: extras.map(e => ({ id: e.id, on: e.selected })),
    })}`;
  }

  private menuCartId(menuId: number, customizations: CartMenuCustomization[]): string {
    return `m_${this.hash({
      menuId,
      custs: customizations.map(c => ({
        slotId: c.slotId,
        pid: c.productId,
        ing: c.ingredients.map(i => ({ id: i.id, on: i.included })),
        ext: c.extras.map(e => ({ id: e.id, on: e.selected })),
      })),
    })}`;
  }


  computeProductPrice(product: Product, extras: Extra[]): number {
    return product.price + extras.filter(e => e.selected).reduce((s, e) => s + e.price, 0);
  }

  computeMenuPrice(menu: Menu, customizations: CartMenuCustomization[]): number {
    const extrasTotal = customizations.reduce((total, cust) => {
      const extrasPrice = cust.extras
        .filter(e => e.selected && e.type !== 'size')
        .reduce((s, e) => s + e.price, 0);
      return total + extrasPrice + (cust.priceDelta || 0);
    }, 0);
    return menu.price + extrasTotal;
  }


  addProduct(product: Product, ingredients: Ingredient[], extras: Extra[]): void {
    const cartItemId = this.productCartId(product.id, ingredients, extras);
    const price = this.computeProductPrice(product, extras);

    this._items.update(items => {
      const existing = items.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return items.map(i =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, {
        cartItemId,
        type: 'product',
        quantity: 1,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          price,
          basePrice: product.price,
          customization: {
            ingredients: ingredients.map(i => ({ ...i })),
            extras: extras.map(e => ({ ...e })),
          },
        },
      }];
    });

    this.persist();
  }

  addMenu(menu: Menu, customizations: CartMenuCustomization[]): void {
    const cartItemId = this.menuCartId(menu.id, customizations);
    const price = this.computeMenuPrice(menu, customizations);

    this._items.update(items => {
      const existing = items.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return items.map(i =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, {
        cartItemId,
        type: 'menu',
        quantity: 1,
        menu: {
          id: menu.id,
          name: menu.name,
          description: menu.description,
          image: menu.image || menu.pictureUrl || '',
          price,
          customizations: customizations.map(c => ({
            slotId: c.slotId,
            slotName: c.slotName,
            productId: c.productId,
            productName: c.productName,
            priceDelta: c.priceDelta,
            ingredients: c.ingredients.map(i => ({ ...i })),
            extras: c.extras.map(e => ({ ...e })),
          })),
        },
      }];
    });

    this.persist();
  }


  updateProductItem(oldId: string, ingredients: Ingredient[], extras: Extra[], basePrice: number): void {
    const item = this._items().find(i => i.cartItemId === oldId);
    if (!item?.product) return;

    const newId = this.productCartId(item.product.id, ingredients, extras);
    const price = basePrice + extras.filter(e => e.selected).reduce((s, e) => s + e.price, 0);

    this._items.update(items => {
      const collision = items.find(i => i.cartItemId === newId);
      if (collision) {
        return items
          .filter(i => i.cartItemId !== oldId)
          .map(i => i.cartItemId === newId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
          );
      }
      return items.map(i => i.cartItemId === oldId ? {
        ...i,
        cartItemId: newId,
        product: {
          ...i.product!,
          price,
          basePrice: basePrice,
          customization: {
            ingredients: ingredients.map(x => ({ ...x })),
            extras: extras.map(x => ({ ...x })),
          },
        },
      } : i);
    });

    this.persist();
  }

  updateMenuItem(oldId: string, customizations: CartMenuCustomization[], basePrice: number): void {
    const item = this._items().find(i => i.cartItemId === oldId);
    if (!item?.menu) return;

    const newId = this.menuCartId(item.menu.id, customizations);
    const extrasTotal = customizations.reduce((total, cust) =>
      total + cust.extras.filter(e => e.selected && e.type !== 'size').reduce((s, e) => s + e.price, 0), 0
    );
    const price = basePrice + extrasTotal;

    this._items.update(items => {
      const collision = items.find(i => i.cartItemId === newId);
      if (collision) {
        return items
          .filter(i => i.cartItemId !== oldId)
          .map(i => i.cartItemId === newId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
          );
      }
      return items.map(i => i.cartItemId === oldId ? {
        ...i,
        cartItemId: newId,
        menu: { ...i.menu!, price, customizations },
      } : i);
    });

    this.persist();
  }


  removeItem(cartItemId: string): void {
    this._items.update(items => items.filter(i => i.cartItemId !== cartItemId));
    this.persist();
  }

  decrementItem(cartItemId: string): void {
    this._items.update(items =>
      items
        .map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );
    this.persist();
  }

  incrementItem(cartItemId: string): void {
    this._items.update(items =>
      items.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i)
    );
    this.persist();
  }

  clearCart(): void {
    this._items.set([]);
    this.persist();
  }


  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._items()));
      console.log('[CartService] localStorage updated :', this._items());
    } catch (e) {
      console.error('[CartService] Échec de persistance :', e);
    }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
