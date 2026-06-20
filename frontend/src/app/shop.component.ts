/**
 * shop.component.ts
 */

import { Component, OnInit, signal } from '@angular/core';
import { ProductCardComponent, Product, Ingredient, Extra } from './components/product-card.component';
import { MenuCardComponent, Menu } from './components/menu-card.component';
import { ProductService } from './services/product.service';

export interface Shop {
  products: Product[],
  menus: Menu[]
}

@Component({
  selector: 'shop',
  standalone: true,
  imports: [ProductCardComponent, MenuCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  shop: Shop = {
    products: [],
    menus: []
  };

  anyExpanded = signal(false);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadShopData();
  }

  loadShopData() {
    this.productService.getProducts(false).subscribe({
      next: (resProduct) => {
        const mappedProducts = (resProduct.data || []).map(p => this.mapProduct(p));
        this.shop.products = mappedProducts;

        this.productService.getMenus(false).subscribe({
          next: (resMenu) => {
            const mappedMenus = (resMenu.data || []).map(m => this.mapMenu(m));
            this.shop.menus = mappedMenus;
          },
          error: (err) => console.error('Failed to load menus:', err)
        });
      },
      error: (err) => console.error('Failed to load products:', err)
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

  private mapMenu(backendMenu: any): Menu {
    const products = (backendMenu.products || []).map((prod: any) => this.mapProduct(prod));
    return {
      id: backendMenu.id,
      name: backendMenu.name,
      description: backendMenu.description || '',
      price: parseFloat(backendMenu.price),
      image: backendMenu.pictureUrl || '',
      products
    };
  }

  closeAll() { this.anyExpanded.set(false); }
}
