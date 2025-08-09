import { describe, expect, it } from 'vitest';
import { formatCurrency } from '@/utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats positive numbers with INR symbol', () => {
    expect(formatCurrency(1234)).toContain('₹');
  });

  it('handles invalid input gracefully', () => {
    // @ts-expect-error testing invalid input
    expect(formatCurrency('invalid')).toBe('₹0');
  });
});
