
// Helper function to format date and time consistently in IST
const formatToIST = (date: Date, includeSeconds = false) => {
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

  const parts = new Intl.DateTimeFormat('en-IN', options).formatToParts(date);
  const values: { [key: string]: string } = {};
  parts.forEach(part => {
    values[part.type] = part.value;
  });

  const datePart = `${values.year}-${values.month}-${values.day}`;
  const timePart = includeSeconds 
    ? `${values.hour}:${values.minute}:${values.second}` 
    : `${values.hour}:${values.minute}`;

  return { datePart, timePart };
};

export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const { datePart, timePart } = formatToIST(date);
    
    console.log('getDateAndTime input:', dateTimeStr);
    console.log('Parsed to:', { date: datePart, time: timePart });
    
    return {
      date: datePart,
      time: timePart
    };
  } catch (error) {
    console.error('Error parsing date:', error);
    return { date: '', time: '' };
  }
};

export const formatDateTime = (date: string, time: string) => {
  if (!date) return '';
  if (!time) time = '00:00';
  
  try {
    const dateTimeStr = `${date}T${time}`;
    
    console.log('formatDateTime input:', { date, time });
    console.log('Formatted:', dateTimeStr);
    
    return dateTimeStr;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
