/**
 * shop.component.ts
 */

import { Component, OnInit, signal, computed } from '@angular/core';
import { ProductCardComponent, Product, Ingredient, Extra } from './components/product-card.component';
import { MenuCardComponent, Menu } from './components/menu-card.component';
import { ProductService } from './services/product.service';

@Component({
  selector: 'shop',
  standalone: true,
  imports: [ProductCardComponent, MenuCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  allProducts = signal<Product[]>([]);
  allMenus = signal<Menu[]>([]);
  categories = signal<any[]>([]);

  // Filter & Sort States
  searchQuery = signal<string>('');
  selectedCategoryId = signal<number | null>(null);
  sortBy = signal<string>('');

  anyExpanded = signal(false);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadShopData();
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data || []);
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  loadShopData() {
    this.productService.getProducts(false).subscribe({
      next: (resProduct) => {
        const mappedProducts = (resProduct.data || []).map(p => this.mapProduct(p));
        this.allProducts.set(mappedProducts);

        this.productService.getMenus(false).subscribe({
          next: (resMenu) => {
            const mappedMenus = (resMenu.data || []).map(m => this.mapMenu(m));
            this.allMenus.set(mappedMenus);
          },
          error: (err) => console.error('Failed to load menus:', err)
        });
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  // Reactive Computed Filters
  filteredProducts = computed(() => {
    let list = [...this.allProducts()];

    // Category Filter
    const catId = this.selectedCategoryId();
    if (catId !== null) {
      list = list.filter(p => p.categoryIds && p.categoryIds.includes(catId));
    }

    // Search Query Filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }

    // Sorting
    const sortType = this.sortBy();
    if (sortType === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'name-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  });

  filteredMenus = computed(() => {
    let list = [...this.allMenus()];

    // Search query also filters menus
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(m => m.name.toLowerCase().includes(query) || m.description.toLowerCase().includes(query));
    }

    // Sorting
    const sortType = this.sortBy();
    if (sortType === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'name-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  });

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  selectCategory(catId: number | null) {
    this.selectedCategoryId.set(catId);
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy.set(select.value);
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
      extras,
      categoryIds: (backendProduct.categories || []).map((c: any) => c.id)
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
