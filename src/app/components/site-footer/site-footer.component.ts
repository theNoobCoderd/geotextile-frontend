import { Component } from '@angular/core';

interface FacebookPage {
  handle: string;
  url: string;
}

@Component({
  selector: 'gtx-site-footer',
  standalone: true,
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  protected readonly year = new Date().getFullYear();

  protected readonly pages: FacebookPage[] = [
    { handle: 'GeotextileMauritius', url: 'https://www.facebook.com/GeotextileMauritius' },
    { handle: 'DIYMauritius', url: 'https://www.facebook.com/DIYMauritius' },
  ];
}
