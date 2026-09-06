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
  inStock: boolean;
  linearMetersNeeded: number;
  billableAreaM2: number;
  extraM2: number; // waste above the recommended area
  isLeastWaste: boolean;
}

/** Result of POST /api/quote — the single source of truth for pricing. */
export interface QuoteResult {
  billableAreaM2: number;
  rollWidthM: number;
  linearMetersNeeded: number;
  pricePerM2: number;
  isBulkRate: boolean;
  subtotalRs: number;
  deliveryCostRs: number;
  grandTotalRs: number;
  depositRs: number;
  balanceRs: number;
}
