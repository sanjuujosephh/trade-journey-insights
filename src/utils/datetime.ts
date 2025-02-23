
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    // Parse the input date (assumes input is already in IST)
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return { date: '', time: '' };
    
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    console.log('Input IST datetime:', dateTimeStr);
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
    
    if (isNaN(istDate.getTime())) return '';
    
    console.log('Input IST date/time:', `${date} ${time}`);
    console.log('Output IST ISO:', istDate.toISOString());
    
    return istDate.toISOString();
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
