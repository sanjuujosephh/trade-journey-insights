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
  const timePart = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  return { datePart, timePart };
}

export function parseDateString(dateString: string): Date | null {
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
  const parts = timeString.split(':');
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
    // For simple time validation, just check if it has numbers and expected characters
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s*[AP]M)?$/.test(timeStr);
  }
  
  return true;
}
