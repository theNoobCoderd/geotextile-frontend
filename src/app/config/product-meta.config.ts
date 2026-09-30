/**
 * Marketing copy (name/icon/description/use-cases) that doesn't exist in
 * product_catalog. Keyed by the exact `product_type` string used in the
 * database (see supabase/functions/get-details). Merged onto the live
 * price_per_m2/bulk_price_per_m2/bulk_threshold_m2 fetched from the API
 * in PricingApiService.
 */
export interface StaticProductMeta {
  name: string;
  icon: string;
  desc: string;
  uses: string[];
}

export const STATIC_PRODUCT_META: Record<string, StaticProductMeta> = {
  '150gsm': {
    name: 'Walkways & paths',
    icon: '🪴',
    desc: 'Lightweight woven fabric for garden paths and light foot traffic.',
    uses: ['Weed barrier', 'Garden paths', 'Light foot traffic'],
  },
  '200gsm': {
    name: 'Heavy-duty applications',
    icon: '🏗️',
    desc: 'Reinforced fabric for driveways, drainage, and erosion control.',
    uses: ['Driveways', 'Drainage', 'Erosion control'],
  },
};

const FALLBACK_META: StaticProductMeta = {
  name: '',
  icon: '📦',
  desc: '',
  uses: [],
};

export function metaForProductType(productType: string): StaticProductMeta {
  return STATIC_PRODUCT_META[productType] ?? FALLBACK_META;
}

/** Parses the leading number out of a `product_type` like '150gsm' -> 150. */
export function parseGsm(productType: string): 150 | 200 | null {
  const match = /^(\d+)gsm$/i.exec(productType.trim());
  if (!match) return null;
  const value = Number(match[1]);
  return value === 150 || value === 200 ? value : null;
}

/** No free-delivery tier exists server-side; kept as an unreachable default. */
export const STATIC_FREE_DELIVERY_THRESHOLD_M2 = Number.POSITIVE_INFINITY;

/** Shown before the first real quote/create-order response overwrites it. */
export const STATIC_DEFAULT_DEPOSIT_PERCENT = 30;

/** Turns a raw zone code (e.g. 'port-louis') into a friendly label. */
export function labelForZone(zone: string): string {
  return zone
    .split(/[-_]/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
