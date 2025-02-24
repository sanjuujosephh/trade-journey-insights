
// Helper function to format date and time consistently in IST
const formatToIST = (date: Date | null | undefined, includeSeconds = false) => {  
  if (!date) return { datePart: '', timePart: '' };
  
  try {
    // Format date part (DD-MM-YYYY)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const datePart = `${day}-${month}-${year}`;

    // Format time part with AM/PM
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    const timePart = includeSeconds 
      ? `${String(hours12).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`
      : `${String(hours12).padStart(2, '0')}:${minutes} ${ampm}`;

    return { datePart, timePart };
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    return { datePart: '', timePart: '' };
  }
};

// Convert a Date object to IST datetime string for database
export const dateToISTString = (date: Date): string => {
  try {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Ensure time is between 9:00 AM and 3:59 PM
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
    const [day, month, year] = datePart.split('-').map(Number);
    let [hour, minute, second] = (timePart || '00:00:00').split(':').map(Number);

    // Ensure time is between 9:00 AM and 3:59 PM
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

    // Convert time to 12-hour format with AM/PM
    const [hours24, minutes] = timePart.split(':');
    const hour24 = parseInt(hours24, 10);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    
    return {
      date: datePart,
      time: `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`
    };
  } catch (error) {
    console.error('Error in getDateAndTime:', error);
    return { date: '', time: '' };
  }
};

// Helper function to format date and time to IST datetime string
export const formatDateTime = (date: string, time: string) => {
  if (!date) return '';
  if (!time) time = '09:00 AM';
  
  try {
    // Parse time to 24-hour format
    const [timePart, meridiem] = time.split(' ');
    const [hours12, minutes] = timePart.split(':');
    let hours24 = parseInt(hours12, 10);
    
    if (meridiem === 'PM' && hours24 !== 12) {
      hours24 += 12;
    } else if (meridiem === 'AM' && hours24 === 12) {
      hours24 = 0;
    }

    // Combine date and time strings
    const timeStr = `${String(hours24).padStart(2, '0')}:${minutes}:00`;
    const dateTimeStr = `${date} ${timeStr}`;
    console.log('Formatting datetime:', dateTimeStr);
    return dateTimeStr;
  } catch (error) {
    console.error('Error in formatDateTime:', error);
    return '';
  }
};
