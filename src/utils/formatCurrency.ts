
export function formatCurrency(amount: number) {
  // Make sure we're dealing with a number
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount));
  
  // Use Intl.NumberFormat for proper currency formatting
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(numericAmount));
}
