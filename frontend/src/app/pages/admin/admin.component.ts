/**
 * admin.component.ts
 */

import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AccountService } from '../../services/account.service';
import { OrderService } from '../../services/order.service';

export type AdminTab = 'products' | 'menus' | 'categories' | 'users' | 'orders';

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryIds?: number[];
  categories?: any[];
}

export interface AdminMenu {
  id: number;
  name: string;
  description: string;
  price: number;
  productIds: number[];
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AdminOrderItem {
  type: 'product' | 'menu';
  name: string;
  quantity: number;
  unitPrice: number;
  customizationSummary?: string;
}

export interface AdminOrder {
  id: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  items: AdminOrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
}


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);
  private accountService = inject(AccountService);
  private orderService = inject(OrderService);

  activeTab = signal<AdminTab>('products');

  products = signal<AdminProduct[]>([]);
  menus = signal<AdminMenu[]>([]);
  categories = signal<any[]>([]);
  users = signal<AdminUser[]>([]);
  orders = signal<AdminOrder[]>([]);

  expandedOrderId = signal<string | null>(null);

  ngOnInit() {
    if (!this.accountService.isLoggedIn() || this.accountService.currentUser?.role !== 'admin') {
      alert("Accès réservé aux administrateurs.");
      this.router.navigate(['/']);
      return;
    }
    this.refreshAll();
  }

  refreshAll() {
    this.loadProducts();
    this.loadMenus();
    this.loadCategories();
    this.loadUsers();
    this.loadOrders();
  }

  loadProducts() {
    this.productService.getProducts(true).subscribe({
      next: (res) => {
        this.products.set((res.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: parseFloat(p.price),
          image: p.pictureUrl || '',
          categoryIds: (p.categories || []).map((c: any) => c.id),
          categories: p.categories || []
        })));
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  loadMenus() {
    this.productService.getMenus(true).subscribe({
      next: (res) => {
        this.menus.set((res.data || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          description: m.description || '',
          price: parseFloat(m.price),
          productIds: (m.products || []).map((p: any) => p.id)
        })));
      },
      error: (err) => console.error('Failed to load menus:', err)
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data || []);
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  loadUsers() {
    this.accountService.getAllAccounts().subscribe({
      next: (res) => {
        this.users.set((res.data || []).map((u: any) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          role: u.role === 'admin' ? 'admin' : 'user',
          createdAt: u.createdAt
        })));
      },
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders.set((res.data || []).map((o: any) => {
          const items = (o.items || []).map((item: any) => {
            let customizationSummary = '';
            if (item.type === 'product' && item.options) {
              customizationSummary = item.options.map((opt: any) => opt.item.name).join(' · ');
            } else if (item.type === 'menu' && item.slots) {
              customizationSummary = item.slots.map((s: any) => {
                const sub = (s.item.options && s.item.options.length) 
                  ? ' (' + s.item.options.map((opt: any) => opt.item.name).join(', ') + ')' 
                  : '';
                return s.item.name + sub;
              }).join(' — ');
            }
            return {
              type: item.type,
              name: item.name,
              quantity: item.quantity,
              unitPrice: parseFloat(item.price),
              customizationSummary
            };
          });

          return {
            id: o.id.toString(),
            createdAt: new Date(o.createdAt).toLocaleString('fr-FR'),
            customer: {
              firstName: o.billingAddress?.firstName || 'Client',
              lastName: o.billingAddress?.lastName || `#${o.customerId}`,
              email: o.billingAddress?.email || '',
              address: o.billingAddress?.street || '',
              city: o.billingAddress?.city || '',
              zip: o.billingAddress?.zip || ''
            },
            items,
            total: parseFloat(o.amount),
            status: this.mapBackendStatusToFrontend(o.status)
          };
        }));
      },
      error: (err) => console.error('Failed to load orders:', err)
    });
  }

  toggleOrder(id: string) {
    this.expandedOrderId.update(current => current === id ? null : id);
  }

  mapBackendStatusToFrontend(status: string): AdminOrder['status'] {
    if (status === 'pending') return 'pending';
    if (status === 'draft') return 'preparing';
    if (status === 'unknown') return 'ready';
    if (status === 'paid') return 'delivered';
    return 'pending';
  }

  mapFrontendStatusToBackend(status: AdminOrder['status']): string {
    if (status === 'pending') return 'pending';
    if (status === 'preparing') return 'draft';
    if (status === 'ready') return 'unknown';
    if (status === 'delivered') return 'paid';
    return 'pending';
  }

  updateOrderStatus(id: string, status: AdminOrder['status']) {
    const backendStatus = this.mapFrontendStatusToBackend(status);
    this.orderService.updateOrderStatus(parseInt(id), backendStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => alert(err.error?.message || 'Failed to update order status')
    });
  }

  orderStatuses: AdminOrder['status'][] = ['pending', 'preparing', 'ready', 'delivered'];

  statusLabel: Record<AdminOrder['status'], string> = {
    pending:   'En attente',
    preparing: 'En préparation',
    ready:     'Prête',
    delivered: 'Livrée',
  };

  get orderStats() {
    const orders = this.orders();
    return {
      total:     orders.length,
      pending:   orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready:     orders.filter(o => o.status === 'ready').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      revenue:   orders.reduce((s, o) => s + o.total, 0),
    };
  }


  showProductForm = signal(false);
  editingProduct = signal<AdminProduct | null>(null);
  productCategorySelection = signal<Set<number>>(new Set());

  showMenuForm = signal(false);
  editingMenu = signal<AdminMenu | null>(null);

  showCategoryForm = signal(false);
  editingCategory = signal<any | null>(null);

  deleteConfirmId = signal<number | null>(null);
  deleteConfirmType = signal<'product' | 'menu' | 'user' | 'category' | null>(null);


  productForm = this.fb.group({
    name:        ['', Validators.required],
    description: ['', Validators.required],
    price:       [0, [Validators.required, Validators.min(0.01)]],
    image:       [''],
  });

  toggleProductCategory(id: number) {
    this.productCategorySelection.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  openCreateProduct() {
    this.editingProduct.set(null);
    this.productForm.reset({ name: '', description: '', price: 0, image: '' });
    this.productCategorySelection.set(new Set());
    this.showProductForm.set(true);
  }

  openEditProduct(p: AdminProduct) {
    this.editingProduct.set(p);
    this.productForm.setValue({ name: p.name, description: p.description, price: p.price, image: p.image });
    this.productCategorySelection.set(new Set(p.categoryIds || []));
    this.showProductForm.set(true);
  }

  submitProduct() {
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    const v = this.productForm.value;
    const editing = this.editingProduct();

    const payload = {
      name: v.name!,
      description: v.description!,
      price: v.price!,
      hidden: false,
      pictureUrl: v.image || '',
      categoryIds: Array.from(this.productCategorySelection())
    };

    if (editing) {
      this.productService.updateProduct(editing.id, payload).subscribe({
        next: () => {
          this.loadProducts();
          this.showProductForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to update product')
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.loadProducts();
          this.showProductForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to create product')
      });
    }
  }

  cancelProductForm() { this.showProductForm.set(false); }


  menuForm = this.fb.group({
    name:        ['', Validators.required],
    description: ['', Validators.required],
    price:       [0, [Validators.required, Validators.min(0.01)]],
  });

  menuProductSelection = signal<Set<number>>(new Set());

  toggleMenuProduct(id: number) {
    this.menuProductSelection.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  openCreateMenu() {
    this.editingMenu.set(null);
    this.menuForm.reset({ name: '', description: '', price: 0 });
    this.menuProductSelection.set(new Set());
    this.showMenuForm.set(true);
  }

  openEditMenu(m: AdminMenu) {
    this.editingMenu.set(m);
    this.menuForm.setValue({ name: m.name, description: m.description, price: m.price });
    this.menuProductSelection.set(new Set(m.productIds));
    this.showMenuForm.set(true);
  }

  submitMenu() {
    if (this.menuForm.invalid) { this.menuForm.markAllAsTouched(); return; }
    const v = this.menuForm.value;
    const productIds = Array.from(this.menuProductSelection());
    const editing = this.editingMenu();

    const payload = {
      name: v.name!,
      description: v.description!,
      price: v.price!,
      hidden: false,
      productIds
    };

    if (editing) {
      this.productService.updateMenu(editing.id, payload).subscribe({
        next: () => {
          this.loadMenus();
          this.showMenuForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to update menu')
      });
    } else {
      this.productService.createMenu(payload).subscribe({
        next: () => {
          this.loadMenus();
          this.showMenuForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to create menu')
      });
    }
  }

  cancelMenuForm() { this.showMenuForm.set(false); }

  productNamesForMenu(productIds: number[]): string {
    return productIds
      .map(id => this.products().find(p => p.id === id)?.name ?? `#${id}`)
      .join(', ');
  }


  // Categories Form
  categoryForm = this.fb.group({
    name: ['', Validators.required]
  });

  openCreateCategory() {
    this.editingCategory.set(null);
    this.categoryForm.reset({ name: '' });
    this.showCategoryForm.set(true);
  }

  openEditCategory(c: any) {
    this.editingCategory.set(c);
    this.categoryForm.setValue({ name: c.name });
    this.showCategoryForm.set(true);
  }

  submitCategory() {
    if (this.categoryForm.invalid) { this.categoryForm.markAllAsTouched(); return; }
    const v = this.categoryForm.value;
    const editing = this.editingCategory();
    const payload = { name: v.name! };

    if (editing) {
      this.productService.updateCategory(editing.id, payload).subscribe({
        next: () => {
          this.loadCategories();
          this.showCategoryForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to update category')
      });
    } else {
      this.productService.createCategory(payload).subscribe({
        next: () => {
          this.loadCategories();
          this.showCategoryForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to create category')
      });
    }
  }

  cancelCategoryForm() { this.showCategoryForm.set(false); }


  // Product Customization Manager
  showSlotManager = signal(false);
  selectedSlotProduct = signal<any | null>(null);
  slots = signal<any[]>([]);

  showSlotForm = signal(false);
  editingSlot = signal<any | null>(null);
  slotForm = this.fb.group({
    categoryId: [0, Validators.required],
    minSelect: [0, [Validators.required, Validators.min(0)]],
    maxSelect: [1, [Validators.required, Validators.min(1)]],
    displayOrder: [0, [Validators.required, Validators.min(0)]]
  });

  showOptionForm = signal(false);
  currentSlot = signal<any | null>(null);
  editingOption = signal<any | null>(null);
  optionForm = this.fb.group({
    productId: [0, Validators.required],
    priceDelta: [0, [Validators.required, Validators.min(0)]],
    isDefault: [false],
    displayOrder: [0, [Validators.required, Validators.min(0)]]
  });

  openSlotManager(product: any) {
    this.selectedSlotProduct.set(product);
    this.loadSlotsForProduct(product.id);
    this.showSlotManager.set(true);
  }

  loadSlotsForProduct(productId: number) {
    this.productService.getSlotsByProductId(productId).subscribe({
      next: (res) => {
        this.slots.set(res.data || []);
      },
      error: (err) => console.error('Failed to load slots:', err)
    });
  }

  openCreateSlot() {
    this.editingSlot.set(null);
    this.slotForm.reset({
      categoryId: this.categories().length ? this.categories()[0].id : 0,
      minSelect: 0,
      maxSelect: 1,
      displayOrder: 0
    });
    this.showSlotForm.set(true);
  }

  openEditSlot(slot: any) {
    this.editingSlot.set(slot);
    this.slotForm.setValue({
      categoryId: slot.categoryId,
      minSelect: slot.minSelect,
      maxSelect: slot.maxSelect,
      displayOrder: slot.displayOrder
    });
    this.showSlotForm.set(true);
  }

  submitSlot() {
    if (this.slotForm.invalid) { this.slotForm.markAllAsTouched(); return; }
    const v = this.slotForm.value;
    const editing = this.editingSlot();
    const product = this.selectedSlotProduct();
    if (!product) return;

    const payload = {
      productId: product.id,
      categoryId: Number(v.categoryId),
      minSelect: Number(v.minSelect),
      maxSelect: Number(v.maxSelect),
      displayOrder: Number(v.displayOrder)
    };

    if (editing) {
      this.productService.updateSlot(editing.id, payload).subscribe({
        next: () => {
          this.loadSlotsForProduct(product.id);
          this.showSlotForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to update slot')
      });
    } else {
      this.productService.createSlot(payload).subscribe({
        next: () => {
          this.loadSlotsForProduct(product.id);
          this.showSlotForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to create slot')
      });
    }
  }

  deleteSlot(slotId: number) {
    if (!confirm('Supprimer ce slot de personnalisation ?')) return;
    const product = this.selectedSlotProduct();
    if (!product) return;

    this.productService.deleteSlot(slotId).subscribe({
      next: () => {
        this.loadSlotsForProduct(product.id);
      },
      error: (err) => alert(err.error?.message || 'Failed to delete slot')
    });
  }

  getEligibleOptionProducts(slot: any): any[] {
    if (!slot) return [];
    return this.products().filter(p => p.categoryIds && p.categoryIds.includes(slot.categoryId));
  }

  openCreateOption(slot: any) {
    this.currentSlot.set(slot);
    this.editingOption.set(null);
    const eligible = this.getEligibleOptionProducts(slot);
    this.optionForm.reset({
      productId: eligible.length ? eligible[0].id : 0,
      priceDelta: 0,
      isDefault: false,
      displayOrder: 0
    });
    this.showOptionForm.set(true);
  }

  openEditOption(slot: any, option: any) {
    this.currentSlot.set(slot);
    this.editingOption.set(option);
    this.optionForm.setValue({
      productId: option.productId,
      priceDelta: parseFloat(option.priceDelta),
      isDefault: !!option.isDefault,
      displayOrder: option.displayOrder
    });
    this.showOptionForm.set(true);
  }

  submitOption() {
    if (this.optionForm.invalid) { this.optionForm.markAllAsTouched(); return; }
    const v = this.optionForm.value;
    const slot = this.currentSlot();
    const editing = this.editingOption();
    const product = this.selectedSlotProduct();
    if (!slot || !product) return;

    const payload = {
      productId: Number(v.productId),
      priceDelta: Number(v.priceDelta),
      isDefault: !!v.isDefault,
      displayOrder: Number(v.displayOrder)
    };

    if (editing) {
      this.productService.updateOptionInSlot(slot.id, payload).subscribe({
        next: () => {
          this.loadSlotsForProduct(product.id);
          this.showOptionForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to update option')
      });
    } else {
      this.productService.addOptionToSlot(slot.id, payload).subscribe({
        next: () => {
          this.loadSlotsForProduct(product.id);
          this.showOptionForm.set(false);
        },
        error: (err) => alert(err.error?.message || 'Failed to add option')
      });
    }
  }

  deleteOption(slot: any, productId: number) {
    if (!confirm('Supprimer cette option ?')) return;
    const product = this.selectedSlotProduct();
    if (!product) return;

    this.productService.removeOptionFromSlot(slot.id, productId).subscribe({
      next: () => {
        this.loadSlotsForProduct(product.id);
      },
      error: (err) => alert(err.error?.message || 'Failed to delete option')
    });
  }


  askDelete(id: number, type: 'product' | 'menu' | 'user' | 'category') {
    this.deleteConfirmId.set(id);
    this.deleteConfirmType.set(type);
  }

  confirmDelete() {
    const id = this.deleteConfirmId();
    const type = this.deleteConfirmType();
    if (!id || !type) return;

    if (type === 'product') {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.deleteConfirmId.set(null);
          this.deleteConfirmType.set(null);
        },
        error: (err) => alert(err.error?.message || 'Failed to delete product')
      });
    } else if (type === 'menu') {
      this.productService.deleteMenu(id).subscribe({
        next: () => {
          this.loadMenus();
          this.deleteConfirmId.set(null);
          this.deleteConfirmType.set(null);
        },
        error: (err) => alert(err.error?.message || 'Failed to delete menu')
      });
    } else if (type === 'user') {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.loadUsers();
          this.deleteConfirmId.set(null);
          this.deleteConfirmType.set(null);
        },
        error: (err) => alert(err.error?.message || 'Failed to delete user')
      });
    } else if (type === 'category') {
      this.productService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.deleteConfirmId.set(null);
          this.deleteConfirmType.set(null);
        },
        error: (err) => alert(err.error?.message || 'Failed to delete category')
      });
    }
  }

  cancelDelete() {
    this.deleteConfirmId.set(null);
    this.deleteConfirmType.set(null);
  }

  toggleUserRole(user: AdminUser) {
    const newRole = user.role === 'admin' ? 'client' : 'admin';
    this.accountService.updateProfile(user.id, { role: newRole as any }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => alert(err.error?.message || 'Failed to change role')
    });
  }

  fieldInvalid(form: any, name: string): boolean {
    const ctrl = form.get(name);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  get adminCount() { return this.users().filter(u => u.role === 'admin').length; }
  get userCount() { return this.users().filter(u => u.role === 'user').length; }
}
