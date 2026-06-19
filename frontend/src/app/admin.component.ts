import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';


export type AdminTab = 'products' | 'menus' | 'users' | 'orders';

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
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
export class AdminComponent {
  private fb = inject(FormBuilder);


  activeTab = signal<AdminTab>('products');


  products = signal<AdminProduct[]>([
    { id: 1, name: 'Kebab Classique', description: 'Pain maison, viande grillée', price: 7.50, image: '' },
    { id: 2, name: 'Burger Classique', description: 'Pain maison, steak, salade', price: 8.00, image: '' },
    { id: 3, name: 'Pizza Classique', description: 'Base tomate, viande kebab', price: 7.00, image: '' },
    { id: 4, name: 'Tacos Classique', description: 'La meilleure brique de Belfort', price: 8.50, image: '' },
    { id: 5, name: 'Frites', description: 'Boîte de frites généreuse', price: 2.50, image: '' },
    { id: 6, name: 'Coca Cherry', description: 'Soda rafraîchissant', price: 1.00, image: '' },
  ]);

  menus = signal<AdminMenu[]>([
    { id: 1, name: 'Menu Kebab', description: 'yummy yummy kebab in my tummy', price: 10.00, productIds: [1, 5, 6] },
    { id: 2, name: 'Menu Tacos', description: 'tacos nacho chimichango', price: 9.00, productIds: [4, 5] },
  ]);

  users = signal<AdminUser[]>([
    { id: 1, firstName: 'Alice', lastName: 'Martin', email: 'alice@example.com', role: 'admin', createdAt: '2024-01-10' },
    { id: 2, firstName: 'Bob', lastName: 'Dupont', email: 'bob@example.com', role: 'user', createdAt: '2024-03-22' },
    { id: 3, firstName: 'Clara', lastName: 'Leclerc', email: 'clara@example.com', role: 'user', createdAt: '2024-05-01' },
  ]);

  orders = signal<AdminOrder[]>([
    {
      id: 'CMD-001',
      createdAt: '2024-06-18 12:34',
      customer: { firstName: 'Bob', lastName: 'Dupont', email: 'bob@example.com', address: '12 rue de la Paix', city: 'Belfort', zip: '90000' },
      items: [
        { type: 'menu', name: 'Menu Kebab', quantity: 2, unitPrice: 10.00, customizationSummary: 'Kebab Classique · Grande · Fromage — Frites · Sauce harissa' },
        { type: 'product', name: 'Coca Cherry', quantity: 1, unitPrice: 1.00 },
      ],
      total: 21.00,
      status: 'delivered',
    },
    {
      id: 'CMD-002',
      createdAt: '2024-06-19 13:10',
      customer: { firstName: 'Clara', lastName: 'Leclerc', email: 'clara@example.com', address: '5 avenue Foch', city: 'Belfort', zip: '90000' },
      items: [
        { type: 'product', name: 'Tacos Classique', quantity: 1, unitPrice: 8.50, customizationSummary: 'Grande · Double viande · Sauce algerienne' },
        { type: 'product', name: 'Frites', quantity: 1, unitPrice: 2.50 },
      ],
      total: 11.00,
      status: 'preparing',
    },
    {
      id: 'CMD-003',
      createdAt: '2024-06-19 14:02',
      customer: { firstName: 'Alice', lastName: 'Martin', email: 'alice@example.com', address: '8 rue Carnot', city: 'Belfort', zip: '90000' },
      items: [
        { type: 'menu', name: 'Menu Tacos', quantity: 1, unitPrice: 9.00 },
      ],
      total: 9.00,
      status: 'pending',
    },
  ]);

  expandedOrderId = signal<string | null>(null);

  toggleOrder(id: string) {
    this.expandedOrderId.update(current => current === id ? null : id);
  }

  updateOrderStatus(id: string, status: AdminOrder['status']) {
    this.orders.update(list => list.map(o => o.id === id ? { ...o, status } : o));
    console.log('[Admin] Statut commande', id, '→', status);
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

  showMenuForm = signal(false);
  editingMenu = signal<AdminMenu | null>(null);

  deleteConfirmId = signal<number | null>(null);
  deleteConfirmType = signal<'product' | 'menu' | 'user' | null>(null);


  productForm = this.fb.group({
    name:        ['', Validators.required],
    description: ['', Validators.required],
    price:       [0, [Validators.required, Validators.min(0.01)]],
    image:       [''],
  });

  openCreateProduct() {
    this.editingProduct.set(null);
    this.productForm.reset({ name: '', description: '', price: 0, image: '' });
    this.showProductForm.set(true);
  }

  openEditProduct(p: AdminProduct) {
    this.editingProduct.set(p);
    this.productForm.setValue({ name: p.name, description: p.description, price: p.price, image: p.image });
    this.showProductForm.set(true);
  }

  submitProduct() {
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    const v = this.productForm.value;
    const editing = this.editingProduct();

    if (editing) {
      this.products.update(list => list.map(p => p.id === editing.id
        ? { ...p, name: v.name!, description: v.description!, price: v.price!, image: v.image ?? '' }
        : p
      ));
      console.log('[Admin] Produit modifié :', { id: editing.id, ...v });
    } else {
      const newId = Math.max(0, ...this.products().map(p => p.id)) + 1;
      const newProduct: AdminProduct = { id: newId, name: v.name!, description: v.description!, price: v.price!, image: v.image ?? '' };
      this.products.update(list => [...list, newProduct]);
      console.log('[Admin] Produit créé :', newProduct);
    }

    this.showProductForm.set(false);
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

    if (editing) {
      this.menus.update(list => list.map(m => m.id === editing.id
        ? { ...m, name: v.name!, description: v.description!, price: v.price!, productIds }
        : m
      ));
      console.log('[Admin] Menu modifié :', { id: editing.id, ...v, productIds });
    } else {
      const newId = Math.max(0, ...this.menus().map(m => m.id)) + 1;
      const newMenu: AdminMenu = { id: newId, name: v.name!, description: v.description!, price: v.price!, productIds };
      this.menus.update(list => [...list, newMenu]);
      console.log('[Admin] Menu créé :', newMenu);
    }

    this.showMenuForm.set(false);
  }

  cancelMenuForm() { this.showMenuForm.set(false); }

  productNamesForMenu(productIds: number[]): string {
    return productIds
      .map(id => this.products().find(p => p.id === id)?.name ?? `#${id}`)
      .join(', ');
  }


  askDelete(id: number, type: 'product' | 'menu' | 'user') {
    this.deleteConfirmId.set(id);
    this.deleteConfirmType.set(type);
  }

  confirmDelete() {
    const id = this.deleteConfirmId();
    const type = this.deleteConfirmType();
    if (!id || !type) return;

    if (type === 'product') {
      this.products.update(list => list.filter(p => p.id !== id));
      console.log('[Admin] Produit supprimé :', id);
    } else if (type === 'menu') {
      this.menus.update(list => list.filter(m => m.id !== id));
      console.log('[Admin] Menu supprimé :', id);
    } else if (type === 'user') {
      this.users.update(list => list.filter(u => u.id !== id));
      console.log('[Admin] Utilisateur supprimé :', id);
    }

    this.deleteConfirmId.set(null);
    this.deleteConfirmType.set(null);
  }

  cancelDelete() {
    this.deleteConfirmId.set(null);
    this.deleteConfirmType.set(null);
  }


  toggleUserRole(user: AdminUser) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.users.update(list => list.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    console.log(`[Admin] Rôle de ${user.email} → ${newRole}`);
  }


  fieldInvalid(form: any, name: string): boolean {
    const ctrl = form.get(name);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  get adminCount() { return this.users().filter(u => u.role === 'admin').length; }
  get userCount() { return this.users().filter(u => u.role === 'user').length; }
}
