import { OrderStatus } from '../config/order-status.config';

/**
 * Row shape returned by the `list-orders` edge function — mirrors the
 * `orders` table columns needed for the admin dashboard.
 */
export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  customer_name: string;
  customer_whatsapp: string;
  notes: string | null;
  product_type: string;
  roll_width_m: number;
  material_area_m2: number;
  fulfillment_mode: 'pickup' | 'delivery';
  zone: string | null;
  delivery_address: string | null;
  grand_total: number;
  deposit_percentage: number;
  deposit_amount: number;
}

export interface OrderStatusHistoryEntry {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_at: string;
}

export interface ListOrdersResponse {
  orders: Order[];
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  newStatus: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  order: Order;
}
