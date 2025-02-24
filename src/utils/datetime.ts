
// Helper function to format date and time consistently in IST
const formatToIST = (date: Date | null | undefined, includeSeconds = false) => {  
  if (!date) return { datePart: '', timePart: '' };
  
  try {
    // Create date forcing IST timezone
    const istDate = new Date(date.getTime());

    // Format date part
    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const day = String(istDate.getDate()).padStart(2, '0');
    const datePart = `${year}-${month}-${day}`;

    // Format time part
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const seconds = String(istDate.getSeconds()).padStart(2, '0');
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
    const adjustedDate = new Date(date);

    // Ensure time is between 9:00 and 15:59
    if (hours < 9) {
      adjustedDate.setHours(9, 0, 0, 0);
    } else if (hours >= 16) {
      adjustedDate.setHours(15, 59, 59, 999);
    }

    const { datePart } = formatToIST(adjustedDate);
    const hours24 = String(adjustedDate.getHours()).padStart(2, '0');
    const minutes = String(adjustedDate.getMinutes()).padStart(2, '0');
    const seconds = String(adjustedDate.getSeconds()).padStart(2, '0');

    return `${datePart}T${hours24}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error in dateToISTString:', error);
    throw error;
  }
};

// Parse an IST datetime string to Date object
export const parseISTString = (dateTimeStr: string): Date => {
  if (!dateTimeStr) throw new Error('No datetime string provided');
  
  try {
    const [datePart, timePart] = dateTimeStr.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    let [hour, minute, second] = (timePart || '00:00:00').split(':').map(Number);

    // Ensure time is between 9:00 and 15:59
    if (hour < 9) {
      hour = 9;
      minute = 0;
      second = 0;
    } else if (hour >= 16) {
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
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateTimeStr);
      return { date: '', time: '' };
    }

    const { datePart, timePart } = formatToIST(date);
    return {
      date: datePart,
      time: timePart
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
    const [hours, minutes] = time.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(Number(hours), Number(minutes), 0);

    // This will enforce trading hours
    const formattedDateTime = dateToISTString(dateObj);
    
    console.log('formatDateTime:', {
      input: { date, time },
      output: formattedDateTime
    });
    
    return formattedDateTime;
  } catch (error) {
    console.error('Error in formatDateTime:', error);
    return '';
  }
};
