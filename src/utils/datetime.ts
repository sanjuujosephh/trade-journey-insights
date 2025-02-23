
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return { date: '', time: '' };
    
    // Add IST offset (5 hours and 30 minutes) to UTC time
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    
    const yyyy = istDate.getUTCFullYear();
    const mm = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(istDate.getUTCDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    
    const hours = String(istDate.getUTCHours()).padStart(2, '0');
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    console.log('Processing datetime:', dateTimeStr);
    console.log('Formatted date (IST):', formattedDate);
    console.log('Formatted time (IST):', formattedTime);
    
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
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    
    // Create date in IST
    const istDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    
    // Convert IST to UTC by subtracting the offset
    const utcDate = new Date(istDate.getTime() - (5.5 * 60 * 60 * 1000));
    
    if (isNaN(utcDate.getTime())) return '';
    
    return utcDate.toISOString();
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
