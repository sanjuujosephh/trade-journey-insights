
export function formatDateTime(dateString: string) {
  if (!dateString) return 'N/A';
  
  try {
    // Parse the ISO string directly without timezone conversion
    const [datePart, timePart] = dateString.split('T');
    if (!datePart || !timePart) return 'Invalid Date';
    
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    // Create date parts array for formatting
    const dateParts = {
      year,
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute)
    };
    
    // Format the time in 12-hour format
    const hour12 = dateParts.hour % 12 || 12;
    const ampm = dateParts.hour >= 12 ? 'PM' : 'AM';
    
    return `${dateParts.day}/${dateParts.month}/${dateParts.year}, ${hour12}:${String(dateParts.minute).padStart(2, '0')} ${ampm}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}
