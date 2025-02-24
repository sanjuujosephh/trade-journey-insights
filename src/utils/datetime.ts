// Helper function to format date and time consistently in IST
export const formatToIST = (date: Date | null | undefined) => {
  if (!date) return { datePart: '', timePart: '' };
  
  try {
    // Format date part (DD-MM-YYYY)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const datePart = `${day}-${month}-${year}`;

    // Format time part with AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timePart = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    return { datePart, timePart };
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    return { datePart: '', timePart: '' };
  }
};

// Format datetime for database (text format)
export const formatDateTime = (date: string, time: string): string | null => {
  if (!date && !time) return null;
  
  try {
    // Format date
    let formattedDate = date;
    if (date) {
      const dateDigits = date.replace(/\D/g, '');
      if (dateDigits.length === 8) {
        formattedDate = `${dateDigits.slice(0, 2)}-${dateDigits.slice(2, 4)}-${dateDigits.slice(4)}`;
      }
    }
    
    // Format time
    let formattedTime = time;
    if (time) {
      const timeParts = time.trim().toUpperCase().split(' ');
      const timeDigits = timeParts[0].replace(/\D/g, '');
      const meridiem = timeParts[1] || '';
      
      if (timeDigits.length === 4 && ['AM', 'PM'].includes(meridiem)) {
        formattedTime = `${timeDigits.slice(0, 2)}:${timeDigits.slice(2)} ${meridiem}`;
      }
    }

    // Return combined datetime if both parts are valid
    if (formattedDate && formattedTime) {
      return `${formattedDate} ${formattedTime}`;
    }
    
    // Return partial datetime
    return date && time ? `${date} ${time}` : null;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return null;
  }
};

// Parse database datetime string to date and time parts
export const getDateAndTime = (dateTimeStr: string | null | undefined) => {
  if (!dateTimeStr) return { date: '', time: '' };
  
  try {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const time = timePart && dateTimeStr.split(' ').slice(1).join(' ');
    return { date: datePart || '', time: time || '' };
  } catch (error) {
    console.error('Error in getDateAndTime:', error);
    return { date: '', time: '' };
  }
};

// Convert Date to IST string format
export const dateToISTString = (date: Date): string => {
  const { datePart, timePart } = formatToIST(date);
  return `${datePart} ${timePart}`;
};

// Parse IST string to Date object
export const parseISTString = (dateTimeStr: string): Date => {
  try {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [time, meridiem] = timePart.split(' ');
    const [hours12, minutes] = time.split(':').map(Number);

    let hours24 = hours12;
    if (meridiem === 'PM' && hours12 !== 12) hours24 += 12;
    if (meridiem === 'AM' && hours12 === 12) hours24 = 0;

    const date = new Date(year, month - 1, day, hours24, minutes);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string format');
    }

    return date;
  } catch (error) {
    console.error('Error parsing IST string:', error);
    throw error;
  }
};
