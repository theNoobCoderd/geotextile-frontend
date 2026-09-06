import { Component } from '@angular/core';
import { BUSINESS_WHATSAPP_LINK } from '../../config/site-config';

@Component({
  selector: 'gtx-whatsapp-fab',
  standalone: true,
  templateUrl: './whatsapp-fab.component.html',
  styleUrl: './whatsapp-fab.component.scss',
})
export class WhatsappFabComponent {
  protected readonly whatsappLink = BUSINESS_WHATSAPP_LINK;
}
