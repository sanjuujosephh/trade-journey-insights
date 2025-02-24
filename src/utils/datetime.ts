
// Helper function to format date and time consistently in IST
const formatToIST = (date: Date, includeSeconds = false) => {
  try {
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
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('en-IN', options);
  const parts = formatter.formatToParts(date);
  const values: { [key: string]: string } = {};
  parts.forEach(part => {
    values[part.type] = part.value;
  });

  // Ensure time is between 9:00 and 15:59
  const hour = parseInt(values.hour);
  if (hour < 9) {
    values.hour = '09';
    values.minute = '00';
    values.second = '00';
  } else if (hour >= 16) {
    values.hour = '15';
    values.minute = '59';
    values.second = '59';
  }

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
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
      second = second || 59;
    }

    const date = new Date(year, month - 1, day, hour, minute, second);
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
  if (!time) time = '09:00';
  
  try {
    // Combine date and time strings
    const dateTimeStr = `${date}T${time}`;
    const parsedDate = parseISTString(dateTimeStr); // This will enforce trading hours
    const formattedDateTime = dateToISTString(parsedDate);
    
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

