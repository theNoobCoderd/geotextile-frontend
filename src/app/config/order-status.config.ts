/**
 * Canonical order status lifecycle. MUST stay in sync with:
 *  - the `orders.status` check constraint / enum in the database
 *  - supabase/list-orders.txt and supabase/update-order-status.txt
 *    (edge functions can't share imports, so the list is duplicated there —
 *    see the "duplicated on purpose" note in supabase/create-order.txt).
 */
export const ORDER_STATUSES = [
  'QUOTE_GENERATED',
  'SENT_TO_WHATSAPP',
  'DEPOSIT_PENDING',
  'DEPOSIT_PAID',
  'ORDERED_FROM_SUPPLIER',
  'FULFILLED',
  'CANCELLED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  QUOTE_GENERATED: 'Quote generated',
  SENT_TO_WHATSAPP: 'Sent to WhatsApp',
  DEPOSIT_PENDING: 'Awaiting deposit',
  DEPOSIT_PAID: 'Deposit paid',
  ORDERED_FROM_SUPPLIER: 'Ordered from supplier',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
};

/** Statuses an admin is allowed to move an order to next, keyed by current status. */
export const NEXT_STATUS_OPTIONS: Record<OrderStatus, OrderStatus[]> = {
  QUOTE_GENERATED: ['SENT_TO_WHATSAPP', 'CANCELLED'],
  SENT_TO_WHATSAPP: ['DEPOSIT_PENDING', 'CANCELLED'],
  DEPOSIT_PENDING: ['DEPOSIT_PAID', 'CANCELLED'],
  DEPOSIT_PAID: ['ORDERED_FROM_SUPPLIER', 'CANCELLED'],
  ORDERED_FROM_SUPPLIER: ['FULFILLED', 'CANCELLED'],
  FULFILLED: [],
  CANCELLED: [],
};
