
/**
 * Utility to load the Razorpay checkout script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    console.log('Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Razorpay script:', error);
      reject(false);
    };
    document.body.appendChild(script);
  });
};
