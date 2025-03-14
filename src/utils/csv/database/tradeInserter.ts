
import { supabase } from "@/lib/supabase";

/**
 * Inserts a processed trade into the database
 * @param trade The processed trade object
 * @returns Result of the insert operation
 */
export async function insertTrade(trade: Record<string, any>): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .insert([trade]);
      
    if (error) {
      console.error('Error inserting trade:', error, trade);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Exception when inserting trade:', err);
    return { success: false, error: errorMessage };
  }
}
