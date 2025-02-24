
// Helper function to format date and time consistently in IST
export const formatToIST = (date: Date | null | undefined) => {
  if (!date) return { datePart: '', timePart: '' };
  
  try {
    // Convert to IST
    const istDate = new Date(date.getTime());
    // Add IST offset (UTC+5:30)
    istDate.setMinutes(istDate.getMinutes() + 330);

    // Format date part (DD-MM-YYYY)
    const day = String(istDate.getDate()).padStart(2, '0');
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const year = istDate.getFullYear();
    const datePart = `${day}-${month}-${year}`;

    // Format time part with AM/PM
    const hours = istDate.getHours();
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const timePart = `${String(hours12).padStart(2, '0')}:${minutes} ${ampm}`;

    return { datePart, timePart };
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    return { datePart: '', timePart: '' };
  }
};

// Format datetime for database (UTC format)
export const formatDateTime = (date: string, time: string): string | null => {
  if (!date || !time) return null;
  
  try {
    // Parse date
    const [day, month, year] = date.split('-').map(Number);
    if (!day || !month || !year) return null;

    // Parse time
    const [timePart, meridiem] = time.split(' ');
    const [hours12, minutes] = timePart.split(':').map(Number);
    if (isNaN(hours12) || isNaN(minutes)) return null;

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

    // Create date in local timezone
    const dateObj = new Date(year, month - 1, day, adjustedHours, adjustedMinutes);
    
    // Convert to UTC ISO string
    return dateObj.toISOString();

  } catch (error) {
    console.error('Error formatting datetime:', error);
    return null;
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

    // Create date in local timezone first
    const localDate = new Date(year, month - 1, day, hours24, minutes);
    
    // Convert local time to UTC by adjusting for IST offset (-5:30)
    const utcDate = new Date(localDate.getTime() - (330 * 60 * 1000));
    
    return utcDate;
  } catch (error) {
    console.error('Error parsing IST string:', error);
    throw error;
  }
};

