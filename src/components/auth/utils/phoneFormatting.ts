/**
 * Formats a phone number to ensure it always starts with +91 (India country code)
 * 
 * @param input The phone number input from the user
 * @returns Formatted phone number with +91 prefix
 */
export function formatPhoneWithIndiaCode(input: string): string {
  if (input.startsWith("+91")) {
    return input;
  } else if (input === "") {
    // If they delete everything, reset to just +91
    return "+91";
  } else if (!input.startsWith("+91")) {
    // If they try to delete or change the prefix, keep the +91 and add their input
    return "+91" + input.replace(/\D/g, '');
  }
  
  return input;
}
