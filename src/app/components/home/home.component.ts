import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../site-header/site-header.component';
import { SiteHeroComponent } from '../site-hero/site-hero.component';
import { WizardShellComponent } from '../wizard-shell/wizard-shell.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { ProductsSectionComponent } from '../products-section/products-section.component';
import { TrackOrderComponent } from '../track-order/track-order.component';
import { FaqSectionComponent } from '../faq-section/faq-section.component';
import { FooterCtaComponent } from '../footer-cta/footer-cta.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';
import { WhatsappFabComponent } from '../whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'gtx-home',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    SiteHeroComponent,
    WizardShellComponent,
    HowItWorksComponent,
    ProductsSectionComponent,
    TrackOrderComponent,
    FaqSectionComponent,
    FooterCtaComponent,
    SiteFooterComponent,
    WhatsappFabComponent,
  ],
  template: `
    <gtx-site-header />
    <gtx-site-hero />
    <gtx-wizard-shell />
    <gtx-how-it-works />
    <gtx-products-section />
    <gtx-track-order />
    <gtx-faq-section />
    <gtx-footer-cta />
    <gtx-site-footer />
    <gtx-whatsapp-fab />
  `,
})
export class HomeComponent {}
