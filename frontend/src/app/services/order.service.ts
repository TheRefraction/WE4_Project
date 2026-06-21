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

  updateInvoiceStatus(id: number, status: string): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.apiUrl}/invoices/${id}`,
      { status },
      { headers: this.authHeaders }
    );
  }

  getInvoices(): Observable<{ success: boolean; message: string; data: any[] }> {
    return this.http.get<{ success: boolean; message: string; data: any[] }>(
      `${this.apiUrl}/invoices`,
      { headers: this.authHeaders }
    );
  }
}
