
/**
 * Converts various date formats to the application's standard DD-MM-YYYY format
 * @param dateStr The date string to convert
 * @returns Formatted date string or null if invalid
 */
export function standardizeDateFormat(dateStr: string): string | null {
  if (!dateStr) return null;
  
  // Try to determine the format and standardize it
  
  // Check if it's already in DD-MM-YYYY format
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
    return dateStr; // Already in correct format
  }
  
  // Try MM/DD/YYYY format (common in US)
  const mmddyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyyMatch) {
    const [, month, day, year] = mmddyyyyMatch;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  
  // Try YYYY-MM-DD format (ISO format)
  const yyyymmddMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  
  // Try DD/MM/YYYY format
  const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  
  // Try to parse with Date object as last resort
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch (e) {
    console.warn(`Could not parse date: ${dateStr}`);
  }
  
  return null; // Return null if we can't parse the date
}

/**
 * Standardizes time formats to HH:MM format (24-hour format)
 * @param timeStr The time string to convert
 * @returns Formatted time string or null if invalid
 */
export function standardizeTimeFormat(timeStr: string): string | null {
  if (!timeStr) return null;
  
  // Remove AM/PM indicators and trim
  let cleanedTime = timeStr.replace(/\s?[AP]M$/i, '').trim();
  
  // Check if it's already in HH:MM or HH:MM:SS format
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(cleanedTime)) {
    // Extract hours and minutes
    const parts = cleanedTime.split(':');
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    
    // Return in HH:MM format
    return `${hours}:${minutes}`;
  }
  
  // Try to parse with Date object as last resort
  try {
    // Create a dummy date with the time
    const dummyDate = new Date(`2000-01-01T${timeStr}`);
    if (!isNaN(dummyDate.getTime())) {
      const hours = dummyDate.getHours().toString().padStart(2, '0');
      const minutes = dummyDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  } catch (e) {
    console.warn(`Could not parse time: ${timeStr}`);
  }
  
  return null; // Return null if we can't parse the time
}
