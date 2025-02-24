
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

// Simple string formatting functions
export const formatDateTime = (date: string, time: string): string | null => {
  if (!date && !time) return null;
  return date && time ? `${date} ${time}` : null;
};

export const getDateAndTime = (dateTimeStr: string | null | undefined) => {
  if (!dateTimeStr) return { date: '', time: '' };
  const [datePart, ...timeParts] = dateTimeStr.split(' ');
  return {
    date: datePart || '',
    time: timeParts.join(' ') || ''
  };
};
