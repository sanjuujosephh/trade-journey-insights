
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    // Create a date object in local time (IST)
    const date = new Date(dateTimeStr);
    
    // Format date to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datePart = `${year}-${month}-${day}`;
    
    // Format time to HH:mm in IST (local time)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    console.log('getDateAndTime input:', dateTimeStr);
    console.log('Parsed to:', { date: datePart, time });
    
    return {
      date: datePart,
      time
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
    // Create datetime string in YYYY-MM-DD HH:mm format (local time/IST)
    const dateTimeStr = `${date}T${time}`;
    
    console.log('formatDateTime input:', { date, time });
    console.log('Formatted:', dateTimeStr);
    
    return dateTimeStr;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
