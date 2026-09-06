import { Component } from '@angular/core';

interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'gtx-how-it-works',
  standalone: true,
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  protected readonly steps: HowItWorksStep[] = [
    {
      number: '01',
      title: 'Calculate',
      description: 'Use the form above. Enter area, choose product, select pickup or delivery.',
    },
    {
      number: '02',
      title: 'See Your Quote',
      description: 'Exact price, no surprises. Volume discounts applied automatically.',
    },
    {
      number: '03',
      title: 'Pay Deposit',
      description: 'Confirm your order with a 30% deposit via Juice or bank transfer.',
    },
    {
      number: '04',
      title: 'Receive',
      description: 'We handle the rest — pickup at Tribeca or delivery island-wide.',
    },
  ];
}
