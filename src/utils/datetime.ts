// Basic function to get current date and time strings in required format
export const formatToIST = (date: Date | null | undefined) => {
  if (!date) return { datePart: '', timePart: '' };
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const isPM = hours >= 12;
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const ampm = isPM ? 'PM' : 'AM';
  
  return {
    datePart: `${day}-${month}-${year}`,
    timePart: `${formattedHours}:${formattedMinutes} ${ampm}`
  };
};

// Format date and time strings with proper validation
export const formatDateTime = (date: string, time: string): string | null => {
  if (!date || !time) return null;
  
  // Validate date format (DD-MM-YYYY)
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (!dateRegex.test(date)) return null;
  
  // Validate time format (HH:MM AM/PM)
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  if (!timeRegex.test(time)) return null;
  
  return `${date} ${time}`;
};

// Safely split datetime string into date and time parts
export const getDateAndTime = (dateTimeStr: string | null | undefined) => {
  if (!dateTimeStr) return { date: '', time: '' };
  
  // Split on the last space to properly handle times with spaces (e.g., "10:00 AM")
  const lastSpaceIndex = dateTimeStr.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return { date: '', time: '' };
  
  // Get everything before the last space as the date
  const date = dateTimeStr.substring(0, lastSpaceIndex - 2).trim();
  // Get everything after, including the AM/PM, as the time
  const time = dateTimeStr.substring(lastSpaceIndex - 2).trim();
  
  return { date, time };
};

export const dateToISTString = (date: Date): string => {
  const { datePart, timePart } = formatToIST(date);
  return `${datePart} ${timePart}`;
};

// Parse string in "DD-MM-YYYY HH:MM AM/PM" format to Date object
export const parseISTString = (dateTimeStr: string): Date => {
  try {
    if (!dateTimeStr) return new Date();
    
    // Expected format: "DD-MM-YYYY HH:MM AM/PM"
    const [datePart, time, period] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    let adjustedHours = hours;
    if (period === 'PM' && hours !== 12) adjustedHours += 12;
    if (period === 'AM' && hours === 12) adjustedHours = 0;
    
    const date = new Date(year, month - 1, day, adjustedHours, minutes);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch (error) {
    console.error('Error parsing date string:', error);
    return new Date();
  }
};
