
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
  if (!date || !time) return null;
  
  // Allow incomplete inputs
  if (date.length < 10 || !date.includes('-')) return null;
  
  try {
    // Parse date
    const [day, month, year] = date.split('-').map(Number);
    if (!day || !month || !year) return null;

    // Parse time
    const timeParts = time.trim().split(' ');
    if (timeParts.length !== 2) return null;
    
    const [timeValue, meridiem] = timeParts;
    if (!timeValue || !meridiem) return null;
    
    const [hours12, minutes] = timeValue.split(':').map(Number);
    if (isNaN(hours12) || isNaN(minutes)) return null;

    // Validate meridiem
    if (!['AM', 'PM'].includes(meridiem)) return null;

    // Convert to 24-hour format
    let hours24 = hours12;
    if (meridiem === 'PM' && hours12 !== 12) hours24 += 12;
    if (meridiem === 'AM' && hours12 === 12) hours24 = 0;

    // Ensure trading hours (9 AM to 3:59 PM)
    let adjustedHours = hours24;
    let adjustedMinutes = minutes;
    
    if (hours24 < 9) {
      adjustedHours = 9;
      adjustedMinutes = 0;
    } else if (hours24 >= 16) {
      adjustedHours = 15;
      adjustedMinutes = 59;
    }

    // Format final datetime string
    const formattedHours = String(adjustedHours % 12 || 12).padStart(2, '0');
    const formattedMinutes = String(adjustedMinutes).padStart(2, '0');
    const ampm = adjustedHours >= 12 ? 'PM' : 'AM';

    return `${date} ${formattedHours}:${formattedMinutes} ${ampm}`;
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
