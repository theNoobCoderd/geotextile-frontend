import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {Observable, of} from 'rxjs';
import { PricingCatalog } from '../models/pricing.model';
import { QuoteResult } from '../models/wizard-state.model';
import {MOCK_PRICING_CATALOG, mockQuoteResult} from '../mocks/pricing-catalog.mock';

export interface QuoteRequest {
  billableInputM2: number; // area the customer asked for, before cut rounding
  buffer: number;          // 0 | 10 | 20
  gsm: 150 | 200;
  rollWidthM: number;
  deliveryZoneId: string | null; // null when pickup
}

@Injectable({ providedIn: 'root' })
export class PricingApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  /** Fetched once when the wizard opens; drives Steps 2 and 3 previews. */
  getPricingCatalog(): Observable<PricingCatalog> {
    return this.http.get<PricingCatalog>(`${this.baseUrl}/pricing`);
  }

  getPricingCatalogMock(): Observable<PricingCatalog> {
    return of(MOCK_PRICING_CATALOG);
  }

  calculateQuoteMock(request: QuoteRequest): Observable<QuoteResult> {
    return of(mockQuoteResult);
  }

  /**
   * Authoritative price calculation. Called when the customer reaches the
   * quote screen — re-validates everything server-side in case the catalog
   * changed since it was fetched, so the wizard never trusts its own math
   * for the final number.
   */
  calculateQuote(request: QuoteRequest): Observable<QuoteResult> {
    return this.http.post<QuoteResult>(`${this.baseUrl}/quote`, request);
  }
}
