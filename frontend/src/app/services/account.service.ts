import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface Account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  role: 'unknown' | 'client' | 'supplier' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: Account;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private currentUserSubject = new BehaviorSubject<Account | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  register(data: RegisterData): Observable<{ message: string; data: Account }> {
    return this.http.post<{ message: string; data: Account }>(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<{ message: string; data: LoginResponse }> {
    return this.http.post<{ message: string; data: LoginResponse }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          const loginData = response.data;
          if (loginData.token) {
            this.setSession(loginData);
          }
        })
      );
  }

  getProfile(): Observable<{ message: string; data: Account }> {
    return this.http.get<{ message: string; data: Account }>(`${this.apiUrl}/profile`, {
      headers: this.authHeaders()
    });
  }

  updateProfile(id: number, data: Partial<Account> & { password?: string }): Observable<{ message: string; data: Account }> {
    return this.http.put<{ message: string; data: Account }>(`${this.apiUrl}/profile/${id}`, data, {
      headers: this.authHeaders()
    });
  }

  deleteAccount(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/profile/${id}`, {
      headers: this.authHeaders()
    });
  }

  getAllAccounts(role?: string): Observable<{ message: string; data: Account[] }> {
    const params = role ? `?role=${role}` : '';
    return this.http.get<{ message: string; data: Account[] }>(`${this.apiUrl}/admin/accounts${params}`, {
      headers: this.authHeaders()
    });
  }

  getAccountById(id: number): Observable<{ message: string; data: Account }> {
    return this.http.get<{ message: string; data: Account }>(`${this.apiUrl}/admin/accounts/${id}`, {
      headers: this.authHeaders()
    });
  }

  private setSession(loginData: LoginResponse) {
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('currentUser', JSON.stringify(loginData.user));
    this.currentUserSubject.next(loginData.user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get currentUser(): Account | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }
}
