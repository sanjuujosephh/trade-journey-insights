
export function formatDateTime(dateString: string) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    // Add IST offset for display
    const istDate = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);
    
    return istDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

