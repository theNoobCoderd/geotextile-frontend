/**
 * Shapes for the `/get-details` Supabase edge function response and the
 * merged catalog used by the wizard. The backend (product_catalog,
 * roll_widths, delivery_zone_pricing tables) only stores the numbers
 * that actually drive pricing — it has no concept of icons, marketing
 * copy, bulk-rate tiers, or free-delivery thresholds. Those are kept as
 * static frontend-only config (see product-meta.config.ts) and merged
 * with the live price/rollWidths/zones fetched from the API.
 */

/** Raw row shape returned by GET /get-details for one product_catalog entry. */
export interface ApiProductCatalogRow {
  product_type: string; // e.g. '150gsm' | '200gsm'
  label: string;
  price_per_m2: number;
}

/** Raw row shape returned by GET /get-details for one roll_widths entry. */
export interface ApiRollWidthRow {
  width_m: number;
}

/** Raw row shape returned by GET /get-details for one delivery_zone_pricing entry. */
export interface ApiDeliveryZoneRow {
  zone: string;
  delivery_fee: number;
}

/** Exact JSON body returned by the `get-details` edge function. */
export interface ApiGetDetailsResponse {
  products: ApiProductCatalogRow[] | null;
  rollWidths: ApiRollWidthRow[] | null;
  deliveryZones: ApiDeliveryZoneRow[] | null;
}

export interface RollOption {
  widthM: number;
}

export interface ProductOption {
  productType: string; // backend key, e.g. '150gsm' — sent verbatim to quote/create-order
  gsm: 150 | 200 | null; // parsed from productType for display; null if unrecognised
  name: string;
  icon: string;
  desc: string;
  uses: string[];
  pricePerM2: number;     // live, from product_catalog.price_per_m2
  bulkPricePerM2: number; // static frontend estimate only — NOT applied by the backend
  bulkThresholdM2: number;
}

export interface DeliveryZone {
  id: string;   // raw zone code from delivery_zone_pricing.zone — sent verbatim to quote/create-order
  label: string;
  costRs: number; // live, from delivery_zone_pricing.delivery_fee
}

export interface PricingCatalog {
  products: ProductOption[];
  rollWidths: number[]; // global active roll widths — not tied to a specific product
  deliveryZones: DeliveryZone[];
  freeDeliveryThresholdM2: number; // static frontend-only hint; backend never waives the fee
  depositPercent: number; // static default shown before a quote is fetched; overwritten by the real quote/create-order response
}
