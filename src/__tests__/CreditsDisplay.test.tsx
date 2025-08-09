import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CreditsDisplay } from '@/components/analytics/CreditsDisplay';

describe('CreditsDisplay', () => {
  it('shows Unlimited/free state', () => {
    const { getByText } = render(
      <CreditsDisplay credits={{ purchased_credits: 0, total_credits_used: 0 }} />
    );
    expect(getByText(/Unlimited/i)).toBeInTheDocument();
    expect(getByText(/FREE/i)).toBeInTheDocument();
  });
});
