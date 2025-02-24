
// Helper function to format date and time consistently in IST
const formatToIST = (date: Date | null | undefined, includeSeconds = false) => {  
  if (!date) return { datePart: '', timePart: '' };
  
  try {
    // Format date part
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datePart = `${year}-${month}-${day}`;

    // Format time part
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const timePart = includeSeconds 
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;

    return { datePart, timePart };
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    return { datePart: '', timePart: '' };
  }
};

// Convert a Date object to IST datetime string
export const dateToISTString = (date: Date): string => {
  try {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Ensure time is between 9:00 and 15:59
    if (hours < 9) {
      date.setHours(9, 0, 0, 0);
    } else if (hours > 15 || (hours === 15 && minutes >= 60)) {
      date.setHours(15, 59, 59, 999);
    }

    const { datePart } = formatToIST(date);
    const hours24 = String(date.getHours()).padStart(2, '0');
    const minutes24 = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${datePart} ${hours24}:${minutes24}:${seconds}`;
  } catch (error) {
    console.error('Error in dateToISTString:', error);
    throw error;
  }
};

// Parse an IST datetime string to Date object
export const parseISTString = (dateTimeStr: string): Date => {
  if (!dateTimeStr) throw new Error('No datetime string provided');
  
  try {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    let [hour, minute, second] = (timePart || '00:00:00').split(':').map(Number);

    // Ensure time is between 9:00 and 15:59
    if (hour < 9) {
      hour = 9;
      minute = 0;
      second = 0;
    } else if (hour > 15 || (hour === 15 && minute >= 60)) {
      hour = 15;
      minute = 59;
      second = 59;
    }

    return new Date(year, month - 1, day, hour, minute, second);
  } catch (error) {
    console.error('Error parsing IST string:', error);
    throw error;
  }
};

// Helper function to get date and time parts from IST datetime string
export const getDateAndTime = (dateTimeStr: string | null | undefined) => {
  if (!dateTimeStr) return { date: '', time: '' };
  
  try {
    const [datePart, timePart] = dateTimeStr.split(' ');
    if (!datePart || !timePart) {
      console.warn('Invalid date string format:', dateTimeStr);
      return { date: '', time: '' };
    }
    
    return {
      date: datePart,
      time: timePart.slice(0, 5) // Get HH:mm part only
    };
  } catch (error) {
    console.error('Error in getDateAndTime:', error);
    return { date: '', time: '' };
  }
};

// Helper function to format date and time to IST datetime string
export const formatDateTime = (date: string, time: string) => {
  if (!date) return '';
  if (!time) time = '09:00';
  
  try {
    // Combine date and time strings
    const dateTimeStr = `${date} ${time}:00`;
    console.log('Formatting datetime:', dateTimeStr);
    return dateTimeStr;
  } catch (error) {
    console.error('Error in formatDateTime:', error);
    return '';
  }
};
