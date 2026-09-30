import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiGetDetailsResponse, DeliveryZone, PricingCatalog, ProductOption } from '../models/pricing.model';
import { CreateOrderResult, QuoteResult } from '../models/wizard-state.model';
import {
  STATIC_DEFAULT_DEPOSIT_PERCENT,
  STATIC_FREE_DELIVERY_THRESHOLD_M2,
  labelForZone,
  metaForProductType,
  parseGsm,
} from '../config/product-meta.config';

/** Body sent to POST /quote — matches supabase/functions/quote/index.ts's QuoteRequest. */
export interface QuoteApiRequest {
  inputMode: 'dimensions' | 'direct_area';
  lengthM?: number;
  widthM?: number;
  areaM2?: number;
  bufferPercent?: 0 | 10 | 20;
  productType: string;
  rollWidthM: number;
  fulfillmentMode?: 'pickup' | 'delivery';
  zone?: string;
}

/** Body sent to POST /create-order — matches supabase/functions/create-order/index.ts's CreateOrderRequest. */
export interface CreateOrderApiRequest extends QuoteApiRequest {
  customerName: string;
  customerWhatsapp: string;
  neededBy?: string;
  notes?: string;
  deliveryAddress?: string;
}

@Injectable({ providedIn: 'root' })
export class PricingApiService {
  private readonly http = inject(HttpClient);
  private readonly functionsUrl = environment.functionsUrl;

  /** All edge functions require the Supabase publishable/anon key on every call. */
  private readonly headers = new HttpHeaders({
    'content-type': 'application/json',
    apikey: environment.supabaseAnonKey,
    authorization: `Bearer ${environment.supabaseAnonKey}`,
  });

  /**
   * Fetched once when the wizard opens; drives the products/roll/delivery
   * pickers. Calls the `get-details` edge function and merges the live
   * numbers with static marketing/bulk-pricing config.
   */
  getPricingCatalog(): Observable<PricingCatalog> {
    return this.http
      .post<ApiGetDetailsResponse>(`${this.functionsUrl}/get-details`, { name: 'storefront' }, { headers: this.headers })
      .pipe(map((raw) => this.toPricingCatalog(raw)));
  }

  /**
   * Authoritative price calculation. Called when the customer clicks
   * "See My Quote" — re-validates everything server-side so the wizard
   * never trusts its own math for the final number.
   */
  calculateQuote(request: QuoteApiRequest): Observable<QuoteResult> {
    return this.http.post<QuoteResult>(`${this.functionsUrl}/quote`, request, { headers: this.headers });
  }

  /**
   * Persists the order once the customer confirms. The server recomputes
   * price/area/deposit from scratch — nothing from the quote step is
   * trusted, only re-sent as the customer's requested inputs.
   */
  createOrder(request: CreateOrderApiRequest): Observable<CreateOrderResult> {
    return this.http.post<CreateOrderResult>(`${this.functionsUrl}/create-order`, request, { headers: this.headers });
  }

  private toPricingCatalog(raw: ApiGetDetailsResponse): PricingCatalog {
    const products: ProductOption[] = (raw.products ?? []).map((row) => {
      const meta = metaForProductType(row.product_type);
      return {
        productType: row.product_type,
        gsm: parseGsm(row.product_type),
        name: row.label || meta.name,
        icon: meta.icon,
        desc: meta.desc,
        uses: meta.uses,
        pricePerM2: Number(row.price_per_m2),
        bulkPricePerM2: Number(row.bulk_price_per_m2),
        bulkThresholdM2: Number(row.bulk_threshold_m2),
      };
    });

    const rollWidths = (raw.rollWidths ?? [])
      .map((row) => Number(row.width_m))
      .sort((a, b) => a - b);

    const deliveryZones: DeliveryZone[] = (raw.deliveryZones ?? []).map((row) => ({
      id: row.zone,
      label: labelForZone(row.zone),
      costRs: Number(row.delivery_fee),
    }));

    return {
      products,
      rollWidths,
      deliveryZones,
      freeDeliveryThresholdM2: STATIC_FREE_DELIVERY_THRESHOLD_M2,
      depositPercent: STATIC_DEFAULT_DEPOSIT_PERCENT,
    };
  }
}
