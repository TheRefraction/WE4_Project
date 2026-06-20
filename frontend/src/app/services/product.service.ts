/**
 * product.service.ts
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient, private accountService: AccountService) {}

  private get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accountService.token}`
    });
  }

  // Products
  getProducts(showHidden = true): Observable<{ message: string; data: any[] }> {
    return this.http.get<{ message: string; data: any[] }>(`${this.apiUrl}/products?showHidden=${showHidden}`);
  }

  getProductFull(id: number): Observable<{ message: string; data: any }> {
    return this.http.get<{ message: string; data: any }>(`${this.apiUrl}/products/${id}/full`);
  }

  createProduct(data: any): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.apiUrl}/products`, data, { headers: this.authHeaders });
  }

  updateProduct(id: number, data: any): Observable<{ message: string; data: any }> {
    return this.http.put<{ message: string; data: any }>(`${this.apiUrl}/products/${id}`, data, { headers: this.authHeaders });
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/products/${id}`, { headers: this.authHeaders });
  }

  // Menus
  getMenus(showHidden = true): Observable<{ message: string; data: any[] }> {
    return this.http.get<{ message: string; data: any[] }>(`${this.apiUrl}/menus?showHidden=${showHidden}`);
  }

  createMenu(data: any): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.apiUrl}/menus`, data, { headers: this.authHeaders });
  }

  updateMenu(id: number, data: any): Observable<{ message: string; data: any }> {
    return this.http.put<{ message: string; data: any }>(`${this.apiUrl}/menus/${id}`, data, { headers: this.authHeaders });
  }

  deleteMenu(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/menus/${id}`, { headers: this.authHeaders });
  }

  // Categories
  getCategories(): Observable<{ message: string; data: any[] }> {
    return this.http.get<{ message: string; data: any[] }>(`${this.apiUrl}/categories`);
  }

  createCategory(data: any): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.apiUrl}/categories/admin`, data, { headers: this.authHeaders });
  }

  updateCategory(id: number, data: any): Observable<{ message: string; data: any }> {
    return this.http.put<{ message: string; data: any }>(`${this.apiUrl}/categories/admin/${id}`, data, { headers: this.authHeaders });
  }

  deleteCategory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/categories/admin/${id}`, { headers: this.authHeaders });
  }

  // Customization Slots
  getSlotsByProductId(productId: number): Observable<{ message: string; data: any[] }> {
    return this.http.get<{ message: string; data: any[] }>(`${this.apiUrl}/customizations/slots/product/${productId}/detail`);
  }

  createSlot(data: any): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.apiUrl}/customizations/slots`, data, { headers: this.authHeaders });
  }

  updateSlot(id: number, data: any): Observable<{ message: string; data: any }> {
    return this.http.put<{ message: string; data: any }>(`${this.apiUrl}/customizations/slots/${id}`, data, { headers: this.authHeaders });
  }

  deleteSlot(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/customizations/slots/${id}`, { headers: this.authHeaders });
  }

  // Customization Options
  addOptionToSlot(slotId: number, data: any): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.apiUrl}/customizations/slots/${slotId}/options`, { ...data, slotId }, { headers: this.authHeaders });
  }

  updateOptionInSlot(slotId: number, data: any): Observable<{ message: string; data: any }> {
    return this.http.put<{ message: string; data: any }>(`${this.apiUrl}/customizations/slots/${slotId}/options`, data, { headers: this.authHeaders });
  }

  removeOptionFromSlot(slotId: number, productId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/customizations/slots/${slotId}/options`, {
      headers: this.authHeaders,
      body: { productId }
    });
  }
}
