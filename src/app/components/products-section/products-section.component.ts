import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { WizardStateService } from '../../services/wizard-state.service';
import { BUSINESS_WHATSAPP_LINK } from '../../config/site-config';

@Component({
  selector: 'gtx-products-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.scss',
})
export class ProductsSectionComponent {
  protected readonly state = inject(WizardStateService);
  protected readonly whatsappLink = BUSINESS_WHATSAPP_LINK;

  protected readonly products = computed(() => this.state.catalog()?.products ?? []);
}
