
import { supabase } from "@/lib/supabase";
import { parseDateString, formatToIST } from "@/utils/datetime";

export async function checkTradeLimit(userId: string | null, entryDate: string, entryTime: string): Promise<boolean> {
  if (!userId) return false;
  
  const date = parseDateString(entryDate);
  if (!date) return false;
  
  const dayStart = new Date(date);
  dayStart.setHours(9, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(15, 59, 59, 999);
  
  const { datePart: startDate, timePart: startTime } = formatToIST(dayStart);
  const { datePart: endDate, timePart: endTime } = formatToIST(dayEnd);
  
  const { data: existingTrades, error } = await supabase
    .from('trades')
    .select('id')
    .eq('entry_date', entryDate)
    .gte('entry_time', startTime)
    .lte('entry_time', endTime)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error checking trade limit:', error);
    return false;
  }
  
  return (existingTrades?.length || 0) < 1;
}
