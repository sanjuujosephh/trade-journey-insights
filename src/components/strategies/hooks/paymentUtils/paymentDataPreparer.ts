
/**
 * Prepares and validates payment data for both Razorpay and test payments
 */
export const preparePaymentData = (
  user: any,
  item: any,
  isFullPackage: boolean
) => {
  if (!user) {
    throw new Error("User is required for payment");
  }

  const amount = (isFullPackage ? 499 : item?.price || 499) * 100; // Amount in paise
  const userName = user?.email?.split('@')[0] || "Trader";
  const userEmail = user?.email || "trader@example.com";
  const description = isFullPackage ? 
    "Monthly Subscription - All Trading Strategies" : 
    item?.title ? `Monthly Subscription - ${item.title}` : "Monthly Subscription";

  console.log('User details for payment:', { name: userName, email: userEmail });
  console.log('Payment amount:', amount/100, 'INR');
  
  return {
    amount,
    userName,
    userEmail,
    description
  };
};
