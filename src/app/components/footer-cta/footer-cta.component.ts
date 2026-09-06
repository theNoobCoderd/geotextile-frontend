import { Component } from '@angular/core';
import { BUSINESS_WHATSAPP_LINK } from '../../config/site-config';

@Component({
  selector: 'gtx-footer-cta',
  standalone: true,
  templateUrl: './footer-cta.component.html',
  styleUrl: './footer-cta.component.scss',
})
export class FooterCtaComponent {
  protected readonly whatsappLink = BUSINESS_WHATSAPP_LINK;

  protected scrollToOrder(): void {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  }
}
