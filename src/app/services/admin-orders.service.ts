import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ListOrdersResponse, Order, UpdateOrderStatusResponse } from '../models/order.model';
import { OrderStatus } from '../config/order-status.config';
import { AuthService } from './auth.service';

/**
 * Calls the admin-only edge functions (`list-orders`, `update-order-status`).
 * Both require a signed-in Supabase session — the user's JWT is forwarded as
 * the Authorization header and verified server-side against the `admins`
 * allowlist table (see supabase/admin-schema.sql).
 */
@Injectable({ providedIn: 'root' })
export class AdminOrdersService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly functionsUrl = environment.functionsUrl;

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'content-type': 'application/json',
      apikey: environment.supabaseAnonKey,
      authorization: `Bearer ${this.auth.accessToken ?? environment.supabaseAnonKey}`,
    });
  }

  listOrders(status?: OrderStatus | 'ALL'): Observable<Order[]> {
    const body = status && status !== 'ALL' ? { status } : {};
    return this.http
      .post<ListOrdersResponse>(`${this.functionsUrl}/list-orders`, body, { headers: this.headers() })
      .pipe(
        map((res) => res.orders ?? []),
        catchError((err) => this.handleError(err)),
      );
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus): Observable<Order> {
    return this.http
      .post<UpdateOrderStatusResponse>(
        `${this.functionsUrl}/update-order-status`,
        { orderId, newStatus },
        { headers: this.headers() },
      )
      .pipe(
        map((res) => res.order),
        catchError((err) => this.handleError(err)),
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const message = err.error?.error ?? (err.status === 403 ? 'Not authorized as admin' : 'Request failed');
    return throwError(() => new Error(message));
  }
}
