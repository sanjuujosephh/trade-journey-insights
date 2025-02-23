
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return { date: '', time: '' };
    
    // Convert UTC to IST by adding 5:30 hours
    const istDate = new Date(date.getTime());
    istDate.setHours(date.getUTCHours() + 5);
    istDate.setMinutes(date.getUTCMinutes() + 30);
    
    const yyyy = istDate.getFullYear();
    const mm = String(istDate.getMonth() + 1).padStart(2, '0');
    const dd = String(istDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    console.log('Input UTC datetime:', dateTimeStr);
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
    
    // Convert IST to UTC by subtracting 5:30 hours
    const utcDate = new Date(istDate.getTime());
    utcDate.setHours(istDate.getHours() - 5);
    utcDate.setMinutes(istDate.getMinutes() - 30);
    
    // Set UTC time components directly
    const utcFinal = new Date(Date.UTC(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      utcDate.getHours(),
      utcDate.getMinutes()
    ));
    
    if (isNaN(utcFinal.getTime())) return '';
    
    console.log('Input IST:', `${date} ${time}`);
    console.log('Output UTC:', utcFinal.toISOString());
    
    return utcFinal.toISOString();
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
