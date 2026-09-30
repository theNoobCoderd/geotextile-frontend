import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { WizardStateService } from '../../services/wizard-state.service';
import { ProductOption } from '../../models/pricing.model';
import { RollCutOption } from '../../models/wizard-state.model';

@Component({
  selector: 'gtx-step-product-roll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-product-roll.component.html',
  styleUrl: './step-product-roll.component.scss',
})
export class StepProductRollComponent {
  protected readonly state = inject(WizardStateService);

  protected readonly products = computed<ProductOption[]>(
    () => this.state.catalog()?.products ?? [],
  );

  protected get canContinue(): boolean {
    const p = this.state.product();
    return !!p.gsm && !!p.rollWidthM;
  }

  protected priceForProduct(product: ProductOption): number {
    // Bulk status is fixed by the Step 1 area for every card, whether or
    // not it's the selected one — no need to click into a product first.
    return this.state.isBulkRateFor(product) ? product.bulkPricePerM2 : product.pricePerM2;
  }

  protected isBulkForProduct(product: ProductOption): boolean {
    return this.state.isBulkRateFor(product);
  }

  protected selectProduct(gsm: 150 | 200 | null): void {
    if (!gsm || this.state.product().gsm === gsm) return;
    this.state.updateProduct({ gsm, rollWidthM: null });
  }

  protected selectRoll(roll: RollCutOption, event: Event): void {
    event.stopPropagation();
    if (!roll.inStock) return;
    this.state.updateProduct({ rollWidthM: roll.widthM });
  }

  protected rollOptionsFor(product: ProductOption): RollCutOption[] {
    // Only the currently-selected product's options are computed in the
    // store (they depend on the recommended area); a not-yet-selected
    // product's rolls aren't shown until it's picked, matching the
    // reference's expand-on-select behaviour.
    if (this.state.product().gsm !== product.gsm) return [];
    return this.state.rollCutOptions();
  }
}
