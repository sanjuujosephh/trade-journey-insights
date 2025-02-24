
// Helper function to format date and time consistently in IST
export const formatToIST = (date: Date | null | undefined, includeSeconds = false) => {  
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
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const timePart = `${String(hours12).padStart(2, '0')}:${minutes} ${ampm}`;

    return { datePart, timePart };
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    return { datePart: '', timePart: '' };
  }
};

// Format datetime string for database (YYYY-MM-DD HH:mm:ss format)
export const formatDateTime = (date: string, time: string): string => {
  if (!date || !time) return '';
  
  try {
    // Parse date
    const [day, month, year] = date.split('-').map(Number);
    if (!day || !month || !year) return '';

    // Parse time
    const [timePart, meridiem] = time.split(' ');
    const [hours12, mins] = timePart.split(':').map(Number);
    if (isNaN(hours12) || isNaN(mins)) return '';

    // Convert to 24-hour format
    let hours24 = hours12;
    let finalMinutes = mins;
    if (meridiem === 'PM' && hours12 !== 12) hours24 += 12;
    if (meridiem === 'AM' && hours12 === 12) hours24 = 0;

    // Ensure trading hours (9 AM to 3:59 PM)
    if (hours24 < 9) {
      hours24 = 9;
      finalMinutes = 0;
    } else if (hours24 >= 16) {
      hours24 = 15;
      finalMinutes = 59;
    }

    // Format for database
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours24).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}:00`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};

// Parse database datetime string to date and time parts
export const getDateAndTime = (dateTimeStr: string | null | undefined) => {
  if (!dateTimeStr) return { date: '', time: '' };
  
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string format:', dateTimeStr);
      return { date: '', time: '' };
    }

    const { datePart, timePart } = formatToIST(date);
    return { date: datePart, time: timePart };
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
      throw new Error('Invalid date');
    }
    return date;
  } catch (error) {
    console.error('Error parsing IST string:', error);
    throw error;
  }
};

