import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'gtx-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
})
export class FaqSectionComponent {
  protected readonly openIndex = signal<number | null>(null);

  protected readonly faqs: FaqItem[] = [
    {
      question: 'Can I buy just 10m²?',
      answer:
        "Absolutely. We cater to small residential orders — 10m² minimum — which commercial suppliers and hardware shops typically ignore.",
    },
    {
      question: 'How quickly can I receive my order?',
      answer:
        'We aim to process orders within 1–2 business days. Weekend orders may take slightly longer. WhatsApp us if your need is urgent.',
    },
    {
      question: 'What is the 30% deposit for?',
      answer:
        'The deposit confirms your order so we can reserve your stock immediately. The balance is paid on delivery or at pickup.',
    },
    {
      question: 'Can I pick up on a weekend?',
      answer:
        'Weekend pickup is possible if we have stock at home. Orders placed Monday–Friday are processed fastest.',
    },
    {
      question: 'Can I transport it in my car?',
      answer:
        'Yes — every order is folded so it fits easily in a car or SUV. You can comfortably carry up to 4 pieces of 100m² folded in a standard car boot.',
    },
    {
      question: 'How do I install geotextile myself?',
      answer:
        'Non-woven geotextile cuts easily with scissors — no special tools needed. We include a step-by-step installation guide with every order.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'Bank transfer, MCB Juice, or MyT Money for the deposit. Balance can be paid cash on delivery or at pickup.',
    },
  ];

  protected toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
