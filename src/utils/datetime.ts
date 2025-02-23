
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    // Parse the input date (assumes input is in ISO format)
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return { date: '', time: '' };
    
    // Add 5 hours and 30 minutes to convert to IST
    const istDate = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);
    
    const yyyy = istDate.getFullYear();
    const mm = String(istDate.getMonth() + 1).padStart(2, '0');
    const dd = String(istDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    console.log('Input ISO datetime:', dateTimeStr);
    console.log('Formatted IST datetime:', `${formattedDate} ${formattedTime}`);
    
    return {
      date: formattedDate,
      time: formattedTime
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
    
    // Create date in IST timezone
    const istDate = new Date(year, month - 1, day, hours, minutes);
    
    // Subtract 5 hours and 30 minutes to convert from IST to UTC
    const utcDate = new Date(istDate.getTime() - (5 * 60 + 30) * 60 * 1000);
    
    if (isNaN(utcDate.getTime())) return '';
    
    console.log('Input IST date/time:', `${date} ${time}`);
    console.log('Output UTC ISO:', utcDate.toISOString());
    
    return utcDate.toISOString();
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};

