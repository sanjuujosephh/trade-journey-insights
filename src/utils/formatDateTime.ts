
export function formatDateTime(dateString: string) {
  if (!dateString) return 'N/A';
  
  try {
    // Create date object in local time (IST)
    const date = new Date(dateString);
    
    // Format the date and time in IST using Indian locale
    const formattedDate = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return `${formattedDate}, ${formattedTime}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}
