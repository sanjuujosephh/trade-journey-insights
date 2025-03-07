
export type PlanFeature = string;

export type PlanType = 'monthly' | 'lifetime';

export interface PricingPlan {
  id: PlanType;
  title: string;
  price: string;
  period: string;
  features: PlanFeature[];
  isBestValue?: boolean;
  buttonText?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    title: 'Monthly Subscription',
    price: '₹199',
    period: '/month',
    features: [
      'Unlimited Trade Entries',
      'Advanced Analytics',
      'AI-Powered Trade Analysis',
      'Behaviour Analysis',
      'Custom Feature Requests'
    ]
  },
  {
    id: 'lifetime',
    title: 'Lifetime Access',
    price: '₹2499',
    period: ' one-time',
    features: [
      'Never Pay Again',
      'Future Feature Updates',
      'Access To Trading Strategies',
      'Access To JOT Indicator Suite',
      'Access To Trading Templates'
    ],
    isBestValue: true
  }
];
