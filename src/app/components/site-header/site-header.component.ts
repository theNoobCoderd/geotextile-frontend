import { Component } from '@angular/core';
import { BUSINESS_WHATSAPP_LINK } from '../../config/site-config';

@Component({
  selector: 'gtx-site-header',
  standalone: true,
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  protected readonly whatsappLink = BUSINESS_WHATSAPP_LINK;

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
