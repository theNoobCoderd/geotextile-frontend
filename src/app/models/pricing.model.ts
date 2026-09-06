/**
 * Shape returned by GET /api/pricing on the Spring Boot side.
 * Kept intentionally flat — this is a read model for the wizard,
 * not the persistence entity. Marketing copy (icon/desc/uses) lives
 * here too since Steps 2 and the Products marketing section both
 * need it and it changes at the same cadence as pricing.
 */
export interface RollOption {
  widthM: number;      // e.g. 2 or 6
  lengthM: number;      // e.g. 100
  inStock: boolean;
}

export interface ProductOption {
  gsm: 150 | 200;
  name: string;           // "Walkway & Garden Path"
  icon: string;           // emoji shown on cards
  desc: string;           // one-line description
  uses: string[];         // tag chips, e.g. "Weed barrier"
  pricePerM2: number;     // standard rate
  bulkPricePerM2: number; // rate applied at >= bulkThresholdM2
  bulkThresholdM2: number;
  rolls: RollOption[];
}

export interface DeliveryZone {
  id: string;
  label: string;
  costRs: number;
}

export interface PricingCatalog {
  products: ProductOption[];
  deliveryZones: DeliveryZone[];
  freeDeliveryThresholdM2: number;
  depositPercent: number; // e.g. 0.30
}
