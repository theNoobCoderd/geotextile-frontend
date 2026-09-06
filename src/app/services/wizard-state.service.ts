import { Injectable, computed, inject, signal } from '@angular/core';
import { PricingApiService } from './pricing-api.service';
import { PricingCatalog, ProductOption } from '../models/pricing.model';
import {
  ContactDetails,
  DeliverySelection,
  ProductSelection,
  QuoteResult,
  RollCutOption,
  SurfaceAreaInput,
} from '../models/wizard-state.model';

const EMPTY_SURFACE: SurfaceAreaInput = {
  lengthM: null,
  widthM: null,
  directM2: null,
  buffer: 10,
};

const EMPTY_PRODUCT: ProductSelection = { gsm: null, rollWidthM: null };
const EMPTY_DELIVERY: DeliverySelection = { mode: null, zoneId: null, address: '' };
const EMPTY_CONTACT: ContactDetails = {
  name: '',
  phone: '',
  dateNeeded: null,
  notes: '',
};

@Injectable({ providedIn: 'root' })
export class WizardStateService {
  private readonly pricingApi = inject(PricingApiService);

  readonly currentStep = signal(1);
  readonly totalSteps = 5;

  readonly catalog = signal<PricingCatalog | null>(null);
  readonly catalogError = signal<string | null>(null);

  readonly surfaceArea = signal<SurfaceAreaInput>({ ...EMPTY_SURFACE });
  readonly product = signal<ProductSelection>({ ...EMPTY_PRODUCT });
  readonly delivery = signal<DeliverySelection>({ ...EMPTY_DELIVERY });
  readonly contact = signal<ContactDetails>({ ...EMPTY_CONTACT });

  readonly quoteResult = signal<QuoteResult | null>(null);
  readonly quoteLoading = signal(false);
  readonly quoteError = signal<string | null>(null);

  /** Raw area before buffer is applied — either L x W or the direct entry. */
  readonly rawAreaM2 = computed(() => {
    const s = this.surfaceArea();
    if (s.directM2 && s.directM2 > 0) return s.directM2;
    if (s.lengthM && s.widthM) return s.lengthM * s.widthM;
    return 0;
  });

  /** Step 1 output: recommended area including the chosen buffer. */
  readonly recommendedAreaM2 = computed(() => {
    const raw = this.rawAreaM2();
    const s = this.surfaceArea();
    return Math.ceil(raw * (1 + s.buffer / 100));
  });

  readonly selectedProductOption = computed<ProductOption | null>(() => {
    const cat = this.catalog();
    const p = this.product();
    if (!cat || !p.gsm) return null;
    return cat.products.find((opt) => opt.gsm === p.gsm) ?? null;
  });

  /**
   * Cut preview for EVERY roll width the selected product ships in — not
   * just the chosen one. Step 2 shows all of them side by side (with
   * "least waste" / "out of stock" badges) so the customer can compare
   * before picking, same as the reference design.
   */
  readonly rollCutOptions = computed<RollCutOption[]>(() => {
    const product = this.selectedProductOption();
    const area = this.recommendedAreaM2();
    if (!product || !area) return [];

    const raw = product.rolls.map((roll) => {
      const linearMetersNeeded = Math.ceil(area / roll.widthM);
      const billableAreaM2 = roll.widthM * linearMetersNeeded;
      return {
        widthM: roll.widthM,
        inStock: roll.inStock,
        linearMetersNeeded,
        billableAreaM2,
        extraM2: billableAreaM2 - area,
      };
    });

    const inStockExtras = raw.filter((r) => r.inStock).map((r) => r.extraM2);
    const minExtra = inStockExtras.length ? Math.min(...inStockExtras) : -1;
    const hasVariation = new Set(inStockExtras).size > 1;

    return raw.map((r) => ({
      ...r,
      isLeastWaste: r.inStock && hasVariation && r.extraM2 === minExtra,
    }));
  });

  /** The single chosen roll's preview, once picked. */
  readonly selectedRollCut = computed<RollCutOption | null>(() => {
    const rollWidth = this.product().rollWidthM;
    if (!rollWidth) return null;
    return this.rollCutOptions().find((r) => r.widthM === rollWidth) ?? null;
  });

  readonly isBulkRate = computed(() => {
    const opt = this.selectedProductOption();
    const cut = this.selectedRollCut();
    if (!opt || !cut) return false;
    return cut.billableAreaM2 >= opt.bulkThresholdM2;
  });

  readonly currentPricePerM2 = computed(() => {
    const opt = this.selectedProductOption();
    if (!opt) return 0;
    return this.isBulkRate() ? opt.bulkPricePerM2 : opt.pricePerM2;
  });

  readonly productSubtotalRs = computed(() => {
    const cut = this.selectedRollCut();
    return cut ? cut.billableAreaM2 * this.currentPricePerM2() : 0;
  });

  readonly qualifiesForFreeDelivery = computed(() => {
    const cat = this.catalog();
    const cut = this.selectedRollCut();
    if (!cat || !cut) return false;
    return cut.billableAreaM2 >= cat.freeDeliveryThresholdM2;
  });

  readonly selectedZone = computed(() => {
    const cat = this.catalog();
    const zoneId = this.delivery().zoneId;
    if (!cat || !zoneId) return null;
    return cat.deliveryZones.find((z) => z.id === zoneId) ?? null;
  });

  loadCatalog(): void {
    this.pricingApi.getPricingCatalogMock().subscribe({
      next: (catalog) => this.catalog.set(catalog),
      error: () =>
        this.catalogError.set(
          'Could not load current pricing. Please refresh the page.',
        ),
    });
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep.set(step);
    }
  }

  nextStep(): void {
    this.goToStep(this.currentStep() + 1);
  }

  previousStep(): void {
    this.goToStep(this.currentStep() - 1);
  }

  updateSurfaceArea(patch: Partial<SurfaceAreaInput>): void {
    this.surfaceArea.update((s) => ({ ...s, ...patch }));
  }

  updateProduct(patch: Partial<ProductSelection>): void {
    this.product.update((p) => ({ ...p, ...patch }));
  }

  updateDelivery(patch: Partial<DeliverySelection>): void {
    this.delivery.update((d) => ({ ...d, ...patch }));
  }

  updateContact(patch: Partial<ContactDetails>): void {
    this.contact.update((c) => ({ ...c, ...patch }));
  }

  /** Calls the backend for the authoritative quote once Step 4 is complete. */
  submitForQuote(): void {
    const p = this.product();
    const d = this.delivery();
    if (!p.gsm || !p.rollWidthM) {
      this.quoteError.set('Select a product and roll width first.');
      return;
    }

    this.quoteLoading.set(true);
    this.quoteError.set(null);

    this.pricingApi
      .calculateQuoteMock({
        billableInputM2: this.recommendedAreaM2(),
        buffer: this.surfaceArea().buffer,
        gsm: p.gsm,
        rollWidthM: p.rollWidthM,
        deliveryZoneId: d.mode === 'delivery' ? d.zoneId : null,
      })
      .subscribe({
        next: (result) => {
          this.quoteResult.set(result);
          this.quoteLoading.set(false);
          this.nextStep();
        },
        error: () => {
          this.quoteError.set(
            'Could not calculate your quote. Please try again.',
          );
          this.quoteLoading.set(false);
        },
      });
  }

  reset(): void {
    this.currentStep.set(1);
    this.surfaceArea.set({ ...EMPTY_SURFACE });
    this.product.set({ ...EMPTY_PRODUCT });
    this.delivery.set({ ...EMPTY_DELIVERY });
    this.contact.set({ ...EMPTY_CONTACT });
    this.quoteResult.set(null);
    this.quoteError.set(null);
  }
}
