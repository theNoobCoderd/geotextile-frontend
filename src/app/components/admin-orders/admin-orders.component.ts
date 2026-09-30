import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminOrdersService } from '../../services/admin-orders.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import {
  NEXT_STATUS_OPTIONS,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  OrderStatus,
} from '../../config/order-status.config';

@Component({
  selector: 'gtx-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent implements OnInit {
  private readonly ordersApi = inject(AdminOrdersService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly statuses = ORDER_STATUSES;
  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly nextStatusOptions = NEXT_STATUS_OPTIONS;

  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly statusFilter = signal<OrderStatus | 'ALL'>('ALL');
  protected readonly updatingOrderId = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.error.set(null);

    this.ordersApi.listOrders(this.statusFilter()).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onFilterChange(status: OrderStatus | 'ALL'): void {
    this.statusFilter.set(status);
    this.refresh();
  }

  changeStatus(order: Order, newStatus: string): void {
    if (!newStatus || newStatus === order.status) {
      return;
    }

    this.updatingOrderId.set(order.id);
    this.error.set(null);

    this.ordersApi.updateOrderStatus(order.id, newStatus as OrderStatus).subscribe({
      next: (updated) => {
        this.orders.update((list) => list.map((o) => (o.id === updated.id ? updated : o)));
        this.updatingOrderId.set(null);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.updatingOrderId.set(null);
      },
    });
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/admin/login');
  }
}
