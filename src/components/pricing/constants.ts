
export type PlanFeature = string;

export type PlanType = 'monthly' | 'yearly';

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
    id: 'yearly',
    title: 'Yearly Subscription',
    price: '₹1499',
    period: '/year',
    features: [
      'Save 37% vs Monthly Plan',
      'Access To Trading Strategies',
      'Access To JOT Indicator Suite',
      'Access To Trading Templates',
      'Future Feature Updates'
    ]
  }
];
