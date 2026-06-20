/**
 * order.service.ts
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient, private accountService: AccountService) {}

  private get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accountService.token}`
    });
  }

  placeOrder(order: any): Observable<{ success: boolean; message: string; data: { id: number } }> {
    return this.http.post<{ success: boolean; message: string; data: { id: number } }>(
      `${this.apiUrl}/invoices`,
      order,
      { headers: this.authHeaders }
    );
  }

  getOrders(): Observable<{ success: boolean; message?: string; data: any[] }> {
    return this.http.get<{ success: boolean; message?: string; data: any[] }>(
      `${this.apiUrl}/invoices`,
      { headers: this.authHeaders }
    );
  }

  updateOrderStatus(id: number, status: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/invoices/${id}/status`,
      { status },
      { headers: this.authHeaders }
    );
  }

  makePayment(invoiceId: number, mode: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/payments`,
      {
        invoiceId,
        mode,
        date: new Date().toISOString()
      },
      { headers: this.authHeaders }
    );
  }
}
