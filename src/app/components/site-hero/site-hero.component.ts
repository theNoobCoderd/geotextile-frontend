import { Component } from '@angular/core';

@Component({
  selector: 'gtx-site-hero',
  standalone: true,
  templateUrl: './site-hero.component.html',
  styleUrl: './site-hero.component.scss',
})
export class SiteHeroComponent {
  protected readonly checks = [
    'No phone calls needed',
    'Exact price instantly',
    'WhatsApp order in 1 tap',
    'Island-wide delivery',
  ];

  protected scrollToOrder(): void {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  }
}
