
export function formatToIST(date: Date): { datePart: string; timePart: string } {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(date.getTime() + istOffset);

  const day = String(istTime.getDate()).padStart(2, '0');
  const month = String(istTime.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = istTime.getFullYear();
  const datePart = `${day}-${month}-${year}`;

  let hours = istTime.getHours();
  const minutes = String(istTime.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const timePart = `${String(hours).padStart(2, '0')}:${minutes}`;

  return { datePart, timePart };
}

export function parseDateString(dateString: string): Date | null {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null;
}

export function parseTimeString(timeString: string): { hours: number | null; minutes: number | null } {
  if (!timeString) return { hours: null, minutes: null };
  
  // Remove AM/PM indicators if present
  const cleanTime = timeString.replace(/\s?[AP]M$/i, '');
  
  const parts = cleanTime.split(':');
  if (parts.length === 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (!isNaN(hours) && !isNaN(minutes)) {
      return { hours, minutes };
    }
  }
  return { hours: null, minutes: null };
}

/**
 * Checks if the given date and time strings form a valid datetime
 * @param dateStr Date string in DD-MM-YYYY format
 * @param timeStr Time string (can be in any format, including "HH:MM AM/PM")
 * @returns true if the date and time are valid
 */
export function isValidDateTime(dateStr: string, timeStr: string): boolean {
  if (!dateStr) return false;

  // Try to parse the date (DD-MM-YYYY format)
  const dateParts = dateStr.split('-');
  if (dateParts.length !== 3) return false;
  
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JS Date
  const year = parseInt(dateParts[2], 10);
  
  // Basic validation
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (day < 1 || day > 31 || month < 0 || month > 11 || year < 2000 || year > 2100) return false;
  
  // If time is provided, do basic validation
  if (timeStr) {
    // Extract just the HH:MM part, ignore AM/PM for database validation
    const cleanTimeStr = timeStr.replace(/\s?[AP]M$/i, '');
    // For simple time validation, just check if it has numbers and a colon
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(cleanTimeStr);
  }
  
  return true;
}

/**
 * Validates that exit datetime is not before entry datetime
 * when both are on the same day
 * @param entryDate Entry date in DD-MM-YYYY format
 * @param entryTime Entry time in HH:MM format
 * @param exitDate Exit date in DD-MM-YYYY format
 * @param exitTime Exit time in HH:MM format
 * @returns true if exit datetime is valid compared to entry datetime
 */
export function isValidExitTime(entryDate: string, entryTime: string, exitDate: string, exitTime: string): boolean {
  // If no exit date/time provided, it's valid (trade might be open)
  if (!exitDate || !exitTime) return true;
  
  // If entry date/time not provided, we can't compare
  if (!entryDate || !entryTime) return true;
  
  // Parse dates
  const entryDateObj = parseDateString(entryDate);
  const exitDateObj = parseDateString(exitDate);
  
  if (!entryDateObj || !exitDateObj) return false;
  
  // If dates are different, we only need to check that exit date is not before entry date
  if (entryDate !== exitDate) {
    return exitDateObj >= entryDateObj;
  }
  
  // If dates are the same, we need to check times
  const entryTimeParts = parseTimeString(entryTime);
  const exitTimeParts = parseTimeString(exitTime);
  
  if (!entryTimeParts.hours || !entryTimeParts.minutes || 
      !exitTimeParts.hours || !exitTimeParts.minutes) {
    return true; // Cannot compare times, assume valid
  }
  
  // Convert to minutes since midnight for easy comparison
  const entryMinutes = entryTimeParts.hours * 60 + entryTimeParts.minutes;
  const exitMinutes = exitTimeParts.hours * 60 + exitTimeParts.minutes;
  
  return exitMinutes >= entryMinutes;
}

/**
 * Converts a Date object to an IST formatted string
 * @param date The date to convert
 * @returns IST formatted date string in the format "DD-MM-YYYY HH:MM"
 */
export function dateToISTString(date: Date): string {
  const { datePart, timePart } = formatToIST(date);
  // Return without AM/PM to avoid database errors
  return `${datePart} ${timePart}`;
}

/**
 * Formats a time string by removing AM/PM for database storage
 * @param timeStr Time string that might include AM/PM
 * @returns Cleaned time string without AM/PM
 */
export function cleanTimeFormat(timeStr: string): string {
  if (!timeStr) return '';
  return timeStr.replace(/\s?[AP]M$/i, '');
}
