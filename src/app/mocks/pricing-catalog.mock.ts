import {PricingCatalog} from '../models/pricing.model';
import {QuoteResult} from '../models/wizard-state.model';

export const MOCK_PRICING_CATALOG: PricingCatalog = {

  products: [
    {
      gsm: 150,
      name: '150gsm — Walkways & paths',
      icon: "",
      desc: "",
      uses: [""],
      pricePerM2: 85,
      bulkPricePerM2: 75,
      bulkThresholdM2: 100,
      rolls: [
        {
          widthM: 2,
          lengthM: 100,
          inStock: true,
        },
        {
          widthM: 6,
          lengthM: 100,
          inStock: true,
        },
      ],
    },
    {
      gsm: 200,
      name: '200gsm — Heavy-duty applications',
      icon: "",
      desc: "",
      uses: [""],
      pricePerM2: 110,
      bulkPricePerM2: 95,
      bulkThresholdM2: 100,
      rolls: [
        {
          widthM: 2,
          lengthM: 100,
          inStock: true,
        },
        {
          widthM: 6,
          lengthM: 100,
          inStock: false,
        },
      ],
    },
  ],

  deliveryZones: [
    {
      id: 'port-louis',
      label: 'Port Louis',
      costRs: 500,
    },
    {
      id: 'north',
      label: 'North',
      costRs: 750,
    },
    {
      id: 'centre',
      label: 'Centre',
      costRs: 600,
    },
    {
      id: 'south',
      label: 'South',
      costRs: 900,
    },
  ],

  freeDeliveryThresholdM2: 200,
  depositPercent: 0.30,
};

export const mockQuoteResult: QuoteResult = {
  billableAreaM2: 12.5,
  rollWidthM: 1.5,
  linearMetersNeeded: 8.33,
  pricePerM2: 450,
  isBulkRate: false,
  subtotalRs: 5625,
  deliveryCostRs: 500,
  grandTotalRs: 6125,
  depositRs: 3062.5,
  balanceRs: 3062.5,
};
