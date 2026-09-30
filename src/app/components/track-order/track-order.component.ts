import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PricingApiService } from '../../services/pricing-api.service';
import { TrackedOrder } from '../../models/track-order.model';
import { CUSTOMER_ORDER_STATUS_LABELS } from '../../config/order-status.config';

@Component({
  selector: 'gtx-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
})
export class TrackOrderComponent {
  private readonly pricingApi = inject(PricingApiService);

  protected readonly statusLabels = CUSTOMER_ORDER_STATUS_LABELS;

  protected phone = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly orders = signal<TrackedOrder[] | null>(null);

  protected search(): void {
    if (!this.phone.trim()) {
      this.error.set('Enter the WhatsApp/phone number you used to order.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.orders.set(null);

    this.pricingApi.trackOrders(this.phone.trim()).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not look up your orders. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
