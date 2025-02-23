
export const getDateAndTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return { date: '', time: '' };
    
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    
    const yyyy = istDate.getFullYear();
    const mm = String(istDate.getMonth() + 1).padStart(2, '0');
    const dd = String(istDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
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
    
    const localDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    
    const utcDate = new Date(localDate.getTime() - (5.5 * 60 * 60 * 1000));
    
    if (isNaN(utcDate.getTime())) return '';
    
    return utcDate.toISOString();
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};
