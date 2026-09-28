import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { WizardStateService } from '../../services/wizard-state.service';
import { WhatsappMessageService } from '../../services/whatsapp-message.service';

interface SummaryRow {
  label: string;
  value: string;
}

@Component({
  selector: 'gtx-quote-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-summary.component.html',
  styleUrl: './quote-summary.component.scss',
})
export class QuoteSummaryComponent {
  protected readonly state = inject(WizardStateService);
  private readonly whatsapp = inject(WhatsappMessageService);

  protected readonly rows = computed<SummaryRow[]>(() => {
    const quote = this.state.quoteResult();
    const product = this.state.selectedProductOption();
    const cut = this.state.selectedRollCut();
    const contact = this.state.contact();
    const surface = this.state.surfaceArea();
    const delivery = this.state.delivery();
    const zone = this.state.selectedZone();

    if (!quote || !product || !cut) return [];

    const rows: SummaryRow[] = [
      { label: 'Customer', value: `${contact.name} — ${contact.phone}` },
      { label: 'Product', value: `${product.gsm}gsm — ${product.name}` },
      {
        label: 'Area',
        value:
          surface.buffer > 0
            ? `${this.state.recommendedAreaM2()}m² (${this.state.rawAreaM2().toFixed(1)}m² + ${surface.buffer}% buffer)`
            : `${this.state.recommendedAreaM2()}m² (no buffer added)`,
      },
      {
        label: 'Roll & cut',
        value: `${cut.widthM}m roll → ${cut.widthM}×${cut.linearMetersNeeded}m = ${cut.billableAreaM2}m²${
          cut.extraM2 > 0 ? ` (+${cut.extraM2}m²)` : ' (exact fit)'
        }`,
      },
      { label: 'Rate', value: `Rs ${quote.unitPrice}/m²` },
      { label: 'Subtotal', value: `Rs ${quote.subtotal}` },
      delivery.mode === 'pickup'
        ? { label: 'Pickup', value: 'Tribeca — Free' }
        : {
            label: 'Delivery',
            value: `${zone?.label ?? ''} — ${quote.deliveryFee === 0 ? 'Free' : 'Rs ' + quote.deliveryFee}`,
          },
    ];

    if (contact.dateNeeded) {
      rows.push({ label: 'Needed by', value: contact.dateNeeded });
    }

    return rows;
  });

  protected readonly orderMessage = computed(() => {
    const quote = this.state.quoteResult();
    const product = this.state.selectedProductOption();
    const cut = this.state.selectedRollCut();
    if (!quote || !product || !cut) return null;

    return this.whatsapp.buildOrderMessage({
      contact: this.state.contact(),
      product,
      rollWidthM: cut.widthM,
      linearMetersNeeded: cut.linearMetersNeeded,
      billableAreaM2: cut.billableAreaM2,
      quote,
      delivery: this.state.delivery(),
      zone: this.state.selectedZone(),
    });
  });

  protected readonly orderResult = computed(() => this.state.orderResult());
  protected readonly orderLoading = computed(() => this.state.orderLoading());
  protected readonly orderError = computed(() => this.state.orderError());

  /** Triggers POST /create-order — the order is only persisted once this succeeds. */
  protected confirmOrder(): void {
    this.state.confirmOrder();
  }

  /** Real WhatsApp link returned by create-order, pre-filled server-side with the persisted order. */
  protected get sendToOumarHref(): string {
    return this.orderResult()?.whatsappLink ?? '#';
  }

  protected get sendToSelfHref(): string {
    const message = this.orderMessage();
    const phone = this.state.contact().phone;
    return message ? this.whatsapp.buildSendToSelfLink(phone, message) : '#';
  }

  protected get canSendCopyToSelf(): boolean {
    return this.whatsapp.hasUsablePhone(this.state.contact().phone);
  }

  /** Goes back to Step 1 to edit — deliberately doesn't clear anything, unlike reset(). */
  protected editOrder(): void {
    this.state.goToStep(1);
  }
}
