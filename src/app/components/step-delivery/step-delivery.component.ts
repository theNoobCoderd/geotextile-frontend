import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { WizardStateService } from '../../services/wizard-state.service';
import { DeliveryZone } from '../../models/pricing.model';
import { FulfillmentMode } from '../../models/wizard-state.model';

@Component({
  selector: 'gtx-step-delivery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-delivery.component.html',
  styleUrl: './step-delivery.component.scss',
})
export class StepDeliveryComponent {
  protected readonly state = inject(WizardStateService);

  protected readonly zones = computed<DeliveryZone[]>(
    () => this.state.catalog()?.deliveryZones ?? [],
  );

  protected get canContinue(): boolean {
    const d = this.state.delivery();
    if (d.mode === 'pickup') return true;
    return d.mode === 'delivery' && !!d.zoneId && d.address.trim().length > 3;
  }

  protected selectMode(mode: FulfillmentMode): void {
    this.state.updateDelivery({ mode });
  }

  protected onZoneChange(zoneId: string): void {
    this.state.updateDelivery({ zoneId: zoneId || null });
  }

  protected onAddressChange(address: string): void {
    this.state.updateDelivery({ address });
  }
}
