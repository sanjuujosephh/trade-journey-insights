
// Helper function to format date and time consistently in IST
const formatToIST = (date: Date, includeSeconds = false) => {
  try {
    // Ensure we're using IST
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
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
  
  // Add IST offset if not present
  const hasOffset = dateTimeStr.includes('+') || dateTimeStr.includes('Z');
  const fullDateTimeStr = hasOffset ? dateTimeStr : `${dateTimeStr}+05:30`;
  
  const date = new Date(fullDateTimeStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  
  return date;
};

export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  
  try {
    const date = parseISTString(dateTimeStr);
    const { datePart, timePart } = formatToIST(date);
    
    console.log('getDateAndTime:', {
      input: dateTimeStr,
      parsed: { date: datePart, time: timePart }
    });
    
    return {
      date: datePart,
      time: timePart
    };
  } catch (error) {
    console.error('Error in getDateAndTime:', error);
    return { date: '', time: '' };
  }
};

export const formatDateTime = (date: string, time: string) => {
  if (!date) return '';
  if (!time) time = '00:00';
  
  try {
    const dateTimeStr = `${date}T${time}+05:30`;
    console.log('formatDateTime:', {
      input: { date, time },
      output: dateTimeStr
    });
    
    return dateTimeStr;
  } catch (error) {
    console.error('Error in formatDateTime:', error);
    return '';
  }
};

