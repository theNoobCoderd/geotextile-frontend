export type BufferChoice = 0 | 10 | 20;
export type FulfillmentMode = 'pickup' | 'delivery';

export interface SurfaceAreaInput {
  lengthM: number | null;
  widthM: number | null;
  directM2: number | null; // used instead of length x width if provided
  buffer: BufferChoice;
}

export interface ProductSelection {
  gsm: 150 | 200 | null;
  rollWidthM: number | null; // 2 or 6
}

export interface DeliverySelection {
  mode: FulfillmentMode | null;
  zoneId: string | null; // only when mode === 'delivery'
  address: string;       // only required when mode === 'delivery'
}

export interface ContactDetails {
  name: string;
  phone: string;
  dateNeeded: string | null; // ISO date, optional
  notes: string;
}

/** Client-side geometry preview for one roll width, shown while picking Step 2. */
export interface RollCutOption {
  widthM: number;
  inStock: boolean; // always true — backend doesn't return per-width stock info
  linearMetersNeeded: number;
  billableAreaM2: number;
  extraM2: number; // waste above the recommended area
  isLeastWaste: boolean;
}

/**
 * Result of POST /quote — the single source of truth for pricing, mirrored
 * 1:1 from the edge function's JSON response (supabase/functions/quote).
 * Field names intentionally match the API rather than earlier UI-only names.
 */
export interface QuoteResult {
  rawArea: number;
  bufferPercent: number;
  unitPrice: number;
  rollWidthM: number;
  fulfillmentMode: 'pickup' | 'delivery';
  zone: string | null;
  depositPercent: number;
  bufferedArea: number;
  materialLength: number;
  materialArea: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  depositAmount: number;
}

/** Result of POST /create-order — the authoritative, persisted order. */
export interface CreateOrderResult extends QuoteResult {
  orderId: string;
  whatsappLink: string;
}
