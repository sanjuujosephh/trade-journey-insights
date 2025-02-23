
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    // Create a local date object (no timezone conversion)
    const [datePart, timePart] = dateTimeStr.split('T');
    if (!datePart) return { date: '', time: '' };
    
    // Extract time from the time part (before the Z or timezone offset if present)
    const timeMatch = timePart?.match(/(\d{2}):(\d{2})/);
    const time = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : '00:00';
    
    console.log('Input datetime:', dateTimeStr);
    console.log('Parsed date and time:', { date: datePart, time });
    
    return {
      date: datePart,
      time: time
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
    const [hours, minutes] = time.split(':').map(Number);
    const [year, month, day] = date.split('-').map(Number);
    
    // Format the date string directly without using Date object
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    
    const isoString = `${formattedDate}T${formattedTime}.000Z`;
    
    console.log('Input date/time:', `${date} ${time}`);
    console.log('Formatted ISO:', isoString);
    
    return isoString;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
