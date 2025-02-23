
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    // Parse the input datetime string
    const date = new Date(dateTimeStr);
    
    // Format date to YYYY-MM-DD
    const datePart = date.toLocaleDateString('en-CA'); // This gives YYYY-MM-DD format
    
    // Format time to HH:mm in IST
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
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
    // Create date string in YYYY-MM-DD HH:mm format
    const dateTimeStr = `${date}T${time}`;
    
    console.log('formatDateTime input:', { date, time });
    console.log('Formatted:', dateTimeStr);
    
    return dateTimeStr;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
