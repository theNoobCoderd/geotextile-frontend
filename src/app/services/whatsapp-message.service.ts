import { Injectable } from '@angular/core';
import { ContactDetails, DeliverySelection, QuoteResult } from '../models/wizard-state.model';
import { ProductOption, DeliveryZone } from '../models/pricing.model';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/site-config';

@Injectable({ providedIn: 'root' })
export class WhatsappMessageService {
  /** Builds the structured order message the customer sends in one tap. */
  buildOrderMessage(params: {
    contact: ContactDetails;
    product: ProductOption;
    rollWidthM: number;
    linearMetersNeeded: number;
    billableAreaM2: number;
    quote: QuoteResult;
    delivery: DeliverySelection;
    zone: DeliveryZone | null;
  }): string {
    const { contact, product, rollWidthM, linearMetersNeeded, billableAreaM2, quote, delivery, zone } = params;

    const lines = [
      `NEW ORDER — Geotextile Mauritius`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Name: ${contact.name.trim()}`,
      `Phone: ${contact.phone.trim()}`,
      contact.dateNeeded ? `Needed by: ${contact.dateNeeded}` : `Needed by: to confirm`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Product: ${product.gsm}gsm — ${product.name}`,
      `Cut: ${rollWidthM}m roll x ${linearMetersNeeded}m = ${billableAreaM2}m²`,
      `Rate: Rs ${quote.unitPrice}/m²`,
      `Subtotal: Rs ${quote.subtotal}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      delivery.mode === 'delivery'
        ? `Delivery: ${zone?.label ?? 'zone TBC'} — Rs ${quote.deliveryFee}\nAddress: ${delivery.address.trim()}`
        : `Pickup at Tribeca — Free`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `TOTAL: Rs ${quote.grandTotal}`,
      `DEPOSIT (${quote.depositPercent}%): Rs ${quote.depositAmount}`,
      `BALANCE: Rs ${Math.round((quote.grandTotal - quote.depositAmount) * 100) / 100}`,
      contact.notes.trim() ? `━━━━━━━━━━━━━━━━━━━━\nNotes: ${contact.notes.trim()}` : null,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Via geotextilemauritius.mu`,
    ];

    return lines.filter((line): line is string => !!line).join('\n');
  }

  /** Link that opens WhatsApp with the business number and the message pre-filled. */
  buildSendToOumarLink(message: string): string {
    return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  /** Link that opens WhatsApp with the customer's own number, for their records. */
  buildSendToSelfLink(customerPhone: string, message: string): string {
    return `https://wa.me/${this.toWaNumber(customerPhone)}?text=${encodeURIComponent(message)}`;
  }

  /** True once the phone entered looks like enough digits to build a wa.me link. */
  hasUsablePhone(customerPhone: string): boolean {
    return this.toWaNumber(customerPhone).length >= 10;
  }

  /** Normalises a Mauritius number into the digits-only format wa.me requires (230 + 8 digits). */
  private toWaNumber(raw: string): string {
    const digits = (raw || '').replace(/\D/g, '').replace(/^0+/, '');
    if (digits.startsWith('230') && digits.length === 11) return digits;
    if (digits.length === 8) return `230${digits}`;
    return digits;
  }
}
