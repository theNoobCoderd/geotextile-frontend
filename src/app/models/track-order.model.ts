import { OrderStatus } from '../config/order-status.config';

/** Row shape returned by the `track-order` edge function. */
export interface TrackedOrder {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  productType: string;
  rollWidthM: number;
  materialAreaM2: number;
  fulfillmentMode: 'pickup' | 'delivery';
  zone: string | null;
  grandTotal: number;
  depositPercent: number;
  depositAmount: number;
}

export interface TrackOrderResponse {
  orders: TrackedOrder[];
}
