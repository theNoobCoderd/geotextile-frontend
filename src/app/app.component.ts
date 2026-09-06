import { Component } from '@angular/core';
import {SiteHeaderComponent} from './components/site-header/site-header.component';
import {SiteHeroComponent} from './components/site-hero/site-hero.component';
import {WizardShellComponent} from './components/wizard-shell/wizard-shell.component';
import {HowItWorksComponent} from './components/how-it-works/how-it-works.component';
import {ProductsSectionComponent} from './components/products-section/products-section.component';
import {FaqSectionComponent} from './components/faq-section/faq-section.component';
import {FooterCtaComponent} from './components/footer-cta/footer-cta.component';
import {SiteFooterComponent} from './components/site-footer/site-footer.component';
import {WhatsappFabComponent} from './components/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    SiteHeroComponent,
    WizardShellComponent,
    HowItWorksComponent,
    ProductsSectionComponent,
    FaqSectionComponent,
    FooterCtaComponent,
    SiteFooterComponent,
    WhatsappFabComponent],
  template: `
    <gtx-site-header />
    <gtx-site-hero />
    <gtx-wizard-shell />
    <gtx-how-it-works />
    <gtx-products-section />
    <gtx-faq-section />
    <gtx-footer-cta />
    <gtx-site-footer />
    <gtx-whatsapp-fab />
  `
})
export class AppComponent {
}
