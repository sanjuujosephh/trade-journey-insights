
// Helper function to format date and time consistently in IST
const formatToIST = (date: Date, includeSeconds = false) => {
  try {
    // Create date string with IST offset
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    if (includeSeconds) {
      options.second = '2-digit';
    }

    const formatter = new Intl.DateTimeFormat('en-IN', options);
    const parts = formatter.formatToParts(date);
    const values: { [key: string]: string } = {};
    parts.forEach(part => {
      values[part.type] = part.value;
    });

    const datePart = `${values.year}-${values.month}-${values.day}`;
    const timePart = includeSeconds 
      ? `${values.hour}:${values.minute}:${values.second}` 
      : `${values.hour}:${values.minute}`;

    return { datePart, timePart };
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    throw error;
  }
};

// Convert a Date object to IST datetime string
export const dateToISTString = (date: Date): string => {
  const { datePart, timePart } = formatToIST(date, true);
  return `${datePart}T${timePart}`;
};

// Parse an IST datetime string to Date object
export const parseISTString = (dateTimeStr: string): Date => {
  if (!dateTimeStr) throw new Error('No datetime string provided');
  
  try {
    // Create a Date object in IST timezone
    const date = new Date(dateTimeStr);
    return date;
  } catch (error) {
    console.error('Error parsing IST string:', error);
    throw error;
  }
};

// Helper function to get date and time parts from IST datetime string
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  
  try {
    const date = parseISTString(dateTimeStr);
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
  if (!time) time = '00:00';
  
  try {
    // Combine date and time strings
    const dateTimeStr = `${date}T${time}`;
    
    console.log('formatDateTime input:', {
      date,
      time,
      combined: dateTimeStr
    });
    
    return dateTimeStr;
  } catch (error) {
    console.error('Error in formatDateTime:', error);
    return '';
  }
};
