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
  getProducts(): Observable<{ success: boolean; message: string; data: any[] }> {
    return this.http.get<{ success: boolean; message: string; data: any[] }>(`${this.apiUrl}/products`);
  }

  getProductDetail(id: number): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.get<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/products/${id}/detail`);
  }

  createProduct(data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/products`, data, { headers: this.authHeaders });
  }

  updateProduct(id: number, data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.put<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/products/${id}`, data, { headers: this.authHeaders });
  }

  deleteProduct(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/products/${id}`, { headers: this.authHeaders });
  }

  // Categories
  getCategories(): Observable<{ success: boolean; message: string; data: any[] }> {
    return this.http.get<{ success: boolean; message: string; data: any[] }>(`${this.apiUrl}/categories`);
  }

  createCategory(data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/categories`, data, { headers: this.authHeaders });
  }

  updateCategory(id: number, data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.put<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/categories/${id}`, data, { headers: this.authHeaders });
  }

  deleteCategory(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/categories/${id}`, { headers: this.authHeaders });
  }

  // Customization Slots
  getSlotsByProductId(productId: number): Observable<{ success: boolean; message: string; data: any[] }> {
    return this.http.get<{ success: boolean; message: string; data: any[] }>(`${this.apiUrl}/slots/product/${productId}/detail`);
  }

  createSlot(data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/slots`, data, { headers: this.authHeaders });
  }

  updateSlot(id: number, data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.put<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/slots/${id}`, data, { headers: this.authHeaders });
  }

  deleteSlot(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/slots/${id}`, { headers: this.authHeaders });
  }

  // Customization Options
  addOptionToSlot(slotId: number, data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/slots/${slotId}/options`, { ...data, slotId }, { headers: this.authHeaders });
  }

  updateOptionInSlot(slotId: number, data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.put<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/slots/${slotId}/options`, data, { headers: this.authHeaders });
  }

  removeOptionFromSlot(slotId: number, productId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/slots/${slotId}/options`, {
      headers: this.authHeaders,
      body: { productId }
    });
  }
}
