
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

// Format date and time strings - allow partial input during typing
export const formatDateTime = (date: string, time: string): string | null => {
  if (!date || !time) return null;
  return `${date} ${time}`;
};

// Safely split datetime string into date and time parts
export const getDateAndTime = (dateTimeStr: string | null | undefined) => {
  if (!dateTimeStr) return { date: '', time: '' };
  
  const parts = dateTimeStr.split(' ');
  if (parts.length < 2) return { date: '', time: '' };
  
  const date = parts[0];
  const time = parts.slice(1).join(' ');
  
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
