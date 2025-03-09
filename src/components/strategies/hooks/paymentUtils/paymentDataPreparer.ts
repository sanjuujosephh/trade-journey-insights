
/**
 * Prepares and validates payment data for both Razorpay and test payments
 */
export const preparePaymentData = (
  user: any,
  item: any,
  isFullPackage: boolean,
  planType = 'monthly'
) => {
  if (!user) {
    throw new Error("User is required for payment");
  }

  // Calculate amount based on plan type
  let amount: number;
  if (planType === 'yearly') {
    amount = 1499 * 100; // Yearly plan costs ₹1499 (amount in paise)
  } else {
    // Default to monthly
    amount = (isFullPackage ? 1499 : item?.price || 199) * 100; // Full package costs ₹1499 (amount in paise)
  }
  
  const userName = user?.email?.split('@')[0] || "Trader";
  const userEmail = user?.email || "trader@example.com";
  
  // Create description based on plan type
  const planTypeText = planType === 'yearly' ? 'Yearly' : 'Monthly';
  const description = isFullPackage ? 
    `${planTypeText} Subscription - All Trading Strategies & Indicators` : 
    item?.title ? `${planTypeText} Subscription - ${item.title}` : `${planTypeText} Subscription`;

  console.log('User details for payment:', { name: userName, email: userEmail });
  console.log('Payment amount:', amount/100, 'INR');
  console.log('Plan type:', planType);
  
  return {
    amount,
    userName,
    userEmail,
    description
  };
};
