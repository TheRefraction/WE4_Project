import { Component, OnInit, signal, computed } from '@angular/core';
import { ProductCardComponent, Product, Ingredient, Extra } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'shop',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  allProducts = signal<Product[]>([]);
  categories = signal<any[]>([]);

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
        if (res.success) {
          this.categories.set(res.data || []);
        }
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  loadShopData() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res.success) {
          const mappedProducts = (res.data || [])
            .filter(p => !p.hidden)
            .map(p => this.mapProduct(p));
          this.allProducts.set(mappedProducts);
        }
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  filteredProducts = computed(() => {
    let list = [...this.allProducts()];

    const catId = this.selectedCategoryId();
    if (catId !== null) {
      list = list.filter(p => p.categoryIds && p.categoryIds.includes(catId));
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }

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

  closeAll() { this.anyExpanded.set(false); }
}
