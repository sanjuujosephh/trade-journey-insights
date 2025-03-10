
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to convert DD-MM-YYYY format to Date object
export function parseTradeDate(dateString: string | null | undefined): Date {
  if (!dateString) return new Date(0);
  
  // Split the date string (expected format: DD-MM-YYYY)
  const [day, month, year] = dateString.split('-').map(Number);
  
  // Create a new Date object (month is 0-indexed in JavaScript)
  return new Date(year, month - 1, day);
}
