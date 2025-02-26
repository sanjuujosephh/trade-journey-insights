
// Basic function to get current date and time strings in required format
export const formatToIST = (date: Date | null | undefined) => {
  if (!date) return { datePart: '', timePart: '' };
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const isPM = hours >= 12;
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');
  const ampm = isPM ? 'PM' : 'AM';
  
  return {
    datePart: `${day}-${month}-${year}`,
    timePart: `${formattedHours}:${minutes} ${ampm}`
  };
};

// Parse time string in HH:MM AM/PM format
export const parseTimeString = (timeStr: string): Date | null => {
  if (!timeStr) return null;
  
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  
  let [_, hours, minutes, period] = match;
  let hour = parseInt(hours);
  const minute = parseInt(minutes);
  
  if (hour > 12 || minute > 59) return null;
  
  if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
  
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return isNaN(date.getTime()) ? null : date;
};

// Validate date string (DD-MM-YYYY format)
export const isValidDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  const [day, month, year] = dateStr.split('-').map(Number);
  if (!day || !month || !year) return false;
  
  const date = new Date(year, month - 1, day);
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year
  );
};

// Validate time string (HH:MM AM/PM format)
export const isValidTime = (timeStr: string): boolean => {
  if (!timeStr) return false;
  return parseTimeString(timeStr) !== null;
};

// Validate the combination of date and time
export const isValidDateTime = (date: string, time: string): boolean => {
  return isValidDate(date) && isValidTime(time);
};

// Parse date string in DD-MM-YYYY format
export const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  const [day, month, year] = dateStr.split('-').map(Number);
  if (!day || !month || !year) return null;
  
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
};

// Convert Date object to IST string format
export const dateToISTString = (date: Date): string => {
  const { datePart, timePart } = formatToIST(date);
  return `${datePart} ${timePart}`;
};
